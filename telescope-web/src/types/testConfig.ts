export enum TestStatus {
    PENDING = 0,
    RUNNING = 1,
    COMPLETED = 2,
    ABORTED = 3,
    FAILED = 4,
    TIMED_OUT = 5,
    CANCELLED = 6,
}

export enum TestSource {
    BASIC = 'basic',
    ADVANCED = 'advanced',
    UPLOAD = 'upload',
    API = 'api',
    CLI = 'cli',
}

export class TestConfig {
    test_id: string;
    url?: string;
    browser?: string;
    source?: TestSource | null;
    name?: string | null;
    description?: string | null;
    owner?: string | null; // user id or email
    cli_command?: string | null;
    device?: string | null;
    status?: TestStatus | null = TestStatus.PENDING;
    created_at: number = Math.floor(Date.now() / 1000);
    // all the cli options for the test, these would be overrides of the default options
    headers?: string | null;
    cookies?: string | null;
    flags?: string | null;
    block_domains?: string | null;
    block?: string | null;
    firefox_prefs?: string | null;
    cpu_throttle?: number | null;
    connection_type?: string | null;
    width?: number | null;
    height?: number | null;
    frame_rate?: number | null;
    disable_js?: boolean | null;
    debug?: boolean | null;
    auth?: string | null;
    timeout?: number | null;
    constructor(data?: Record<string, any>) {
        this.test_id = generateTestID();
        if (data) {
            this.url = data.url || '';
            this.browser = data.browser || '';
            this.source = data.source || null;
            this.name = data.name || null;
            this.description = data.description || null;
            this.owner = data.owner || null;
            this.cli_command = data.cli_command || null;
            this.device = data.device || null;
            this.headers = data.headers || null;
            this.cookies = data.cookies || null;
            this.flags = data.flags || null;
            this.block_domains = data.block_domains || null;
            this.block = data.block || null;
            this.firefox_prefs = data.firefox_prefs || null;
            this.cpu_throttle = data.cpu_throttle || null;
            this.connection_type = data.connection_type || null;
            this.width = data.width || null;
            this.height = data.height || null;
            this.frame_rate = data.frame_rate || null;
            this.disable_js = data.disable_js || null;
            this.debug = data.debug || null;
            this.auth = data.auth || null;
            this.timeout = data.timeout || null;
            this.status = data.status || TestStatus.PENDING;
        }
    }

    isValid(): boolean {
        return this.url !== '' && this.browser !== '';
    }
}

function generateTestID(): string {
    let date_ob = new Date();
    // adjust 0 before single digit value
    let date = ('0' + date_ob.getDate()).slice(-2);
    let month = ('0' + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hour = ('0' + date_ob.getHours()).slice(-2);
    let minute = ('0' + date_ob.getMinutes()).slice(-2);
    let second = ('0' + date_ob.getSeconds()).slice(-2);
    return year + '_' + month + '_' + date + '_' + hour + '_' + minute + '_' + second + '_' + generatePseudoRandomUUID();

    function generatePseudoRandomUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}