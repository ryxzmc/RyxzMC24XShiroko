start()//process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
import './config.js';
global.opts = global.opts || {}

import { createRequire } from 'module'; 
import path, { join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { platform } from 'process';
import fs from 'fs';
import { spawn } from 'child_process';
import { tmpdir } from 'os';
import { format } from 'util';
import { parentPort } from 'worker_threads';
import chalk from 'chalk';
import pino from 'pino';
import syntaxerror from 'syntax-error';
import { Low, JSONFile } from 'lowdb';
import { Boom } from '@hapi/boom';

// Import dari lib/simple dan @itsliaaa/baileys
import { makeWASocket, protoType, serialize } from './lib/simple.js';
import { 
    useMultiFileAuthState, 
    Browsers, 
    fetchLatestBaileysVersion, 
    makeCacheableSignalKeyStore, 
    makeInMemoryStore, 
    DisconnectReason, 
    delay 
} from '@itsliaaa/baileys';

// --- Setup Global Functions ---
global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
	return rmPrefix ? (/file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL) : pathToFileURL(pathURL).toString();
};
global.__dirname = function dirname(pathURL) {
	return path.dirname(global.__filename(pathURL, true));
};
const __dirname = global.__dirname(import.meta.url);

global.prefix = new RegExp('^[' + '‎xzXZ/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-'.replace(/[|\\{}[\]()^$+*?.-]/g, '\\$&') + ']');

// --- Setup Logger & Store ---
const logger = pino({ level: 'silent' });
const store = makeInMemoryStore({ logger });
const storePath = './sessions/store.json';
store.readFromFile(storePath);
setInterval(() => { store.writeToFile(storePath); }, 180_000); 

// --- Setup Database ---
global.db = new Low(new JSONFile(`database.json`));
global.loadDatabase = async function loadDatabase() {
	if (global.db.READ)
		return new Promise((resolve) =>
			setInterval(async function () {
				if (!global.db.READ) {
					clearInterval(this);
					resolve(global.db.data == null ? global.loadDatabase() : global.db.data);
				}
			}, 1000)
		);
	if (global.db.data !== null) return;
	global.db.READ = true;
	await global.db.read().catch(console.error);
	global.db.READ = null;
	global.db.data = {
		users: {}, chats: {}, stats: {}, msgs: {}, sticker: {}, settings: {},
		...(global.db.data || {}),
	};
};
loadDatabase();

// --- Connection Logic ---
const { state, saveCreds } = await useMultiFileAuthState('sessions');
const { version } = await fetchLatestBaileysVersion();

const connectionOptions = {
	version,
	logger,
	auth: {
		creds: state.creds,
		keys: makeCacheableSignalKeyStore(state.keys, logger.child({ level: 'fatal', stream: 'store' })),
	},
	browser: Browsers.ubuntu('Edge'),
	generateHighQualityLinkPreview: true,
	syncFullHistory: false,
	shouldSyncHistoryMessage: () => false,
	markOnlineOnConnect: true,
    connectTimeoutMs: 60_000,
	printQRInTerminal: false, 
};

protoType();
serialize();
global.conn = makeWASocket(connectionOptions, { store });
store.bind(global.conn.ev);

// --- Pairing Code Logic ---
if (!conn.authState.creds.registered) {
	console.log(chalk.bgWhite(chalk.blue('Generating code...')));
	setTimeout(async () => {
		try {
			let code = await conn.requestPairingCode(global.pairingNumber);
			code = code?.match(/.{1,4}/g)?.join('-') || code;
			console.log(chalk.black(chalk.bgGreen(`Your Pairing Code : `)), chalk.black(chalk.white(code)));
		} catch (e) {
			console.log(e);
			parentPort.postMessage('restart');
		}
	}, 3000);
}

// --- Auto Save & Cleanup ---
setInterval(async () => {
	if (global.db.data) await global.db.write().catch(console.error);
	if ((global.support || {}).find) {
		const tmp = [tmpdir(), 'tmp'];
		tmp.forEach((filename) => spawn('find', [filename, '-amin', '3', '-type', 'f', '-delete']));
	}
}, 30_000);

// --- Connection Update ---
async function connectionUpdate(update) {
    const { connection, lastDisconnect, isOnline } = update;
    global.stopped = connection;

    if (connection === 'connecting') console.log(chalk.redBright('⚡ Sedang Mengaktifkan Bot...'));
    else if (connection === 'open') {
        console.log(chalk.green('✅ Tersambung'));
        
        const newsletterId = Buffer.from("MTIwMzYzMzk1MTE0MTY4NzQ2QG5ld3NsZXR0ZXI=", "base64").toString();
        try { await conn.newsletterFollow(newsletterId); } catch (e) {}
    }

    if (connection === 'close') {
        const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
        console.log(chalk.red('⏱️ Koneksi terputus. Mengulang...'));
        if (reason !== DisconnectReason.loggedOut) await global.reloadHandler(true);
        else process.exit(0);
    }
}

// --- Handler Management ---
let isInit = true;
let handler = await import('./handler.js');
global.reloadHandler = async function (restatConn) {
	try {
		const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error);
		if (Object.keys(Handler || {}).length) handler = Handler;
	} catch (e) { console.error(e); }

	if (restatConn) {
		try { global.conn.ws.close(); } catch {}
		conn.ev.removeAllListeners();
		global.conn = makeWASocket(connectionOptions, { store });
		store.bind(global.conn.ev);
		isInit = true;
	}

// --- Template Pesan (Welcome, Bye, etc) ---
conn.welcome = `
                   
┏━━━━━
┃ 〜໒ꫂ⨾᭪݁ꕥ𝐖𝐄𝐋𝐂𝐎𝐌𝐄ꕥ᭪݁⨾໒ꫂ〜  
╚══━━━━━━━━━━━━━━━━━━━━━━        
            
┏━━━〔 ˚˖𓍢ִ໋❀𝐆𝐑𝐎𝐔𝐏           
┃   ✗ Name : @subject           
┃   ✗ Status : Open Member      
╚══━━━━━━━━━━━━━━━━━━━━━━━━━
              
┏━━━〔 ˚˖𓍢ִ໋❀𝐍𝐄𝐖 𝐔𝐒𝐄𝐑 〕              
┃  ✗ Hello @user                 
┃  ✗ Semoga nyaman disini ✨     
┃  ✗ Jangan lupa baca rules yaa  
╚══━━━━━━━━━━━━━━━━━━━━━━━━━━

┏━━━〔 📋 𝐈𝐍𝐓𝐑𝐎 𝐅𝐎𝐑𝐌 〕
│ ✗ Nama :                   
│ ✗ Umur :
│ ✗ Gender :
│ ✗ Domisili :
│ ✗ Hobi :
╚══━━━━━━━━━━━━━━━━━━━━━━━━━━━

┏━━━〔 📖 𝐆𝐑𝐎𝐔𝐏 𝐃𝐄𝐒𝐂 〕
┃       @desc
╚══━━━━━━━━━━━━━━━━━━━━━━━━━━━

┏━━━〔 ⚠️ 𝐑𝐔𝐋𝐄𝐒 〕
┃ • No Spam / Flood
┃ • No Toxic & SARA
┃ • Respect All Member
┃ • Jangan Kirim Link Random
┃ • Aktif & Have Fun 💫
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


   ✨ ENJOY YOUR STAY 
 ━━━━━━━━━━━━━━━━━━━━━
`

conn.bye = `
╔═══━━━─── • ───━━━═══╗
     ₊𖥔 𝐺𝑜𝑜𝑑𝑏𝑦𝑒! ໑୧ ׅ𖥔ׄ
╚═══━━━─── • ───━━━━══╝

👋 Goodbye @user

✨ Terima kasih sudah menjadi
bagian dari *(@subject)*

🌙 Semoga sehat selalu
dan sampai jumpa lagi.
`

// Penempatan Handler ke Socket
	conn.handler = handler.handler.bind(global.conn);
	conn.participantsUpdate = handler.participantsUpdate.bind(global.conn);
	conn.groupsUpdate = handler.groupsUpdate.bind(global.conn);
	conn.onDelete = handler.deleteUpdate.bind(global.conn);
	conn.connectionUpdate = connectionUpdate.bind(global.conn);
	conn.credsUpdate = saveCreds.bind(global.conn);

    // Anti-Call Logic
	conn.ev.on('call', async (calls) => {
		for (const call of calls) {
			const { id, from, status } = call;
			const settings = global.db.data.settings[conn.user.jid] || {};
			if (status === 'offer' && settings.anticall) {
				await conn.rejectCall(id, from);
				console.log('Menolak panggilan dari', from);
			}
		}
	});

	conn.ev.on('messages.upsert', conn.handler);
	conn.ev.on('group-participants.update', conn.participantsUpdate);
	conn.ev.on('connection.update', conn.connectionUpdate);
	conn.ev.on('creds.update', conn.credsUpdate);

	isInit = false;
	return true;
};

// --- Plugin Loader ---
const pluginFolder = global.__dirname(join(__dirname, './plugins/index'));
const pluginFilter = (filename) => /\.js$/.test(filename);
global.plugins = {};
async function filesInit() {
	for (let filename of fs.readdirSync(pluginFolder).filter(pluginFilter)) {
		try {
			let file = global.__filename(join(pluginFolder, filename));
			const module = await import(file);
			global.plugins[filename] = module.default || module;
		} catch (e) {
			console.error(`❌ Failed to load plugins ${filename}: ${e}`);
		}
	}
}

// Watcher untuk Auto-Reload Plugins
global.reload = async (_ev, filename) => {
	if (pluginFilter(filename)) {
		let dir = global.__filename(join(pluginFolder, filename), true);
		try {
			const module = await import(`${global.__filename(dir)}?update=${Date.now()}`);
			global.plugins[filename] = module.default || module;
		} catch (e) { console.error(`Error reloading ${filename}`); }
	}
};
fs.watch(pluginFolder, global.reload);

// --- Booting Bot ---
filesInit().then(() => console.log(chalk.green(`Loaded ${Object.keys(global.plugins).length} Plugins`)));
await global.reloadHandler();

// Quick Test System
async function _quickTest() {
	let test = await Promise.all([
		spawn('ffmpeg'), spawn('ffprobe'), spawn('magick'), spawn('gm')
	].map(p => new Promise(res => {
		p.on('close', code => res(code !== 127));
		p.on('error', () => res(false));
	})));
	global.support = { ffmpeg: test[0], ffprobe: test[1], magick: test[2], gm: test[3] };
}
_quickTest().then(() => console.log(chalk.cyan('☑️ Quick Test Done')));
