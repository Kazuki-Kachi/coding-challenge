import { spawnSync } from 'child_process'
import pino from 'pino'

const logger = pino({
    level: 'debug',
    prettyPrint: {
        colorize: true,
        levelFirst: true,
        translateTime: 'yyyy-mm-dd HH:MM:ss',
        ignore: 'pid,hostname'
    }
})

const successPrint = (message: string) => logger.info(`️✔️  ${message}`)
const processPrint = (message: string) => logger.info(`⚙️  ${message}`)
const warningPrint = (message: string) => logger.warn(`️⚠️  ${message}`)
const errorPrint = (message: string) => logger.error(`️❌  ${message}`)

const executeTerminalCommand = async (command: string) =>
    spawnSync(command,  { maxBuffer: 1024 * 1024,  encoding: 'utf8', shell: true})

const environmentCheck = async (profile: string, bucket: string, distributionId: string) => {

    processPrint('環境確認を開始します')
    const region = await executeTerminalCommand(`aws configure get ${profile}.aws_access_key_id`)
    if(!region.stdout) {
        errorPrint(`[${profile}] ブロックが ~/.aws/credentials に存在しません`)
        throw Error()
    }
    successPrint('credential OK')

    const environmentExist = await executeTerminalCommand(`aws ssm get-parameter --name /annowork/environment --profile ${profile}`)
    if(environmentExist.stderr) {
        errorPrint(`System Managerのパラメータストアに、/annowork/environmentが存在しません`)
        throw Error()
    }
    successPrint(`System Manager Parameter Store OK Name:/annowork/environment`)
    const environment = JSON.parse(environmentExist.stdout).Parameter.Value

    const bucketExist = await executeTerminalCommand(`aws s3 ls s3://${bucket} --profile ${profile}`)
    if(bucketExist.stderr) {
        errorPrint(`S3 Bucket ${bucket} が存在しません`)
        throw Error()
    }
    successPrint(`S3 Bucket OK NAME:${bucket}`)

    const distributionExist = await executeTerminalCommand(`aws cloudfront get-distribution-config --id ${distributionId} --profile ${profile}`)
    if(distributionExist.stderr) {
        errorPrint(`CloudFront distribution ${distributionId} が存在しません`)
        throw Error()
    }
    successPrint(`CloudFront Distribution OK distributionId:${distributionId}`)

    processPrint(`deploy先の環境は${environment}です`)
    if(process.argv.includes('--production') && environment == 'production') {
        warningPrint('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
        warningPrint(`!! deploy先の環境は${environment}環境です !!`)
        warningPrint('!! 意図しない場合は、10秒以内に本プロセスを止めてください（Ctrl+Cなど） ')
        warningPrint('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
        await new Promise(resolve => setTimeout(resolve, 10000))
    }

    return environment
}

const build = async (stage: string): Promise<void> => {
    processPrint('packageのインストールをします')
    await executeTerminalCommand(`npm ci`)

    processPrint('buildを開始します')
    const buildResult = await executeTerminalCommand(`npm run build:${stage}`)
    if(buildResult.status) {
        errorPrint('buildに失敗しました')
        errorPrint(buildResult.stderr)
        throw Error()
    }
    successPrint('build done')
}

const deploy = async (bucket: string, profile: string): Promise<void> => {

    processPrint(`profile は --profile ${profile} でデプロイします。`)
    processPrint(`client/dist 以下のファイルを${bucket}のS3 BucketにUploadします`)
    const bucketSync = await executeTerminalCommand(`aws s3 sync ./dist s3://${bucket}/ --include "*" --profile ${profile}`)
    if(bucketSync.stderr) {
        errorPrint(`S3 Bucket ${bucket} へのUploadが失敗しました`)
        throw Error(bucketSync.stderr)
    }
    successPrint('deploy done')
}

const cacheClear = async (profile: string, distributionId: string): Promise<void> => {

    processPrint(`CloudFront DistributionIde: ${distributionId} のCache Clearを行います`)
    const cacheClear = await executeTerminalCommand(`aws cloudfront create-invalidation --distribution-id ${distributionId} --paths "/*" --profile ${profile}`)
    if(cacheClear.stderr) {
        errorPrint(`Cloud Front distribution ${distributionId} のCache Clearに失敗しました`)
        throw Error(cacheClear.stderr)
    }
    successPrint('cache clear done')
}

const main = async (): Promise<number> => {
    if (!process.argv.includes('--bucket')) {
        errorPrint('--bucketは必須項目です')
        return 1
    }
    const bucket = process.argv[process.argv.indexOf('--bucket') + 1]


    if (!process.argv.includes('--distribution-id')) {
        errorPrint('--distribution-idは必須項目です')
        return 1
    }
    const distributionId = process.argv[process.argv.indexOf('--distribution-id') + 1]

    if(!process.argv.includes('--profile')) warningPrint('profile指定がないので、defaultProfileを使用します')
    const profile = (!process.argv.includes('--profile')) ? 'default' : process.argv[process.argv.indexOf('--profile') + 1]

    try {
        const environment = await environmentCheck(profile, bucket, distributionId)
        await build(environment)
        await deploy(bucket, profile)
        await cacheClear(profile, distributionId)
        successPrint(`終了日: ${new Date().toString()}`)
        return 0
    } catch (err) {
        errorPrint(`終了日: ${new Date().toString()}`)
        return 1
    }
}

main().then(exitCode => process.exit(exitCode))