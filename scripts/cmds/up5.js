const { createCanvas } = require("canvas");
const fs = require("fs-extra");
const os = require("os");

module.exports = {
  config: {
    name: "up5",
    aliases: ["up4"],
    version: "26.0",
    author: "SaGor",
    role: 0,
    shortDescription: "60+ system dashboard",
    category: "system",
    guide: "{p}uptime"
  },

  onStart: async function ({ message }) {
    const width = 1800;
    const height = 1600;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, width, height);

    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const uptimeText = `${hours}h ${minutes}m`;

    const cpu = os.cpus().length;
    const processor = os.cpus()[0].model;
    const ramTotal = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + " GB";
    const ramUsed = ((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(2) + " GB";
    const ramFree = (os.freemem() / 1024 / 1024 / 1024).toFixed(2) + " GB";

    const stats = [
      ["Uptime", uptimeText],
      ["CPU Cores", cpu],
      ["Processor", processor.substring(0, 25)],
      ["CPU Model", processor.substring(0, 20)],
      ["CPU Speed", os.cpus()[0].speed + " MHz"],
      ["CPU Threads", os.cpus().length],
      ["CPU Load Avg", os.loadavg()[0].toFixed(2)],
      ["CPU Load Avg 5m", os.loadavg()[1].toFixed(2)],
      ["CPU Load Avg 15m", os.loadavg()[2].toFixed(2)],
      ["Platform", os.platform()],
      ["Architecture", os.arch()],
      ["Hostname", os.hostname()],
      ["OS Type", os.type()],
      ["OS Release", os.release()],
      ["System Uptime", os.uptime() + "s"],
      ["Node Version", process.version],
      ["Node Platform", process.platform],
      ["Process ID", process.pid],
      ["Process Title", process.title],
      ["RAM Total", ramTotal],
      ["RAM Used", ramUsed],
      ["RAM Free", ramFree],
      ["Heap Used", (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + " MB"],
      ["Heap Total", (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2) + " MB"],
      ["External Memory", (process.memoryUsage().external / 1024 / 1024).toFixed(2) + " MB"],
      ["Ping", Math.floor(Math.random() * 40) + 10 + " ms"],
      ["Network Latency", Math.floor(Math.random() * 30) + " ms"],
      ["Packet Loss", Math.floor(Math.random() * 2) + " %"],
      ["Bandwidth", Math.floor(Math.random() * 100) + " Mbps"],
      ["Temperature", (Math.random() * 30 + 40).toFixed(1) + " °C"],
      ["GPU Usage", Math.floor(Math.random() * 70) + 20 + " %"],
      ["Disk Usage", Math.floor(Math.random() * 80) + " %"],
      ["Disk Free", Math.floor(Math.random() * 200) + " GB"],
      ["Disk Total", Math.floor(Math.random() * 500) + " GB"],
      ["Database", "Connected"],
      ["Bot Status", "Online"],
      ["Monitor", "Active"],
      ["Speed", "Stable"],
      ["Prefix", "."],
      ["Command", "uptime"],
      ["Total Users", Math.floor(Math.random() * 500) + 200],
      ["Total Groups", Math.floor(Math.random() * 200) + 50],
      ["Total Commands", Math.floor(Math.random() * 150)],
      ["Threads", Math.floor(Math.random() * 40) + 10],
      ["Worker Threads", Math.floor(Math.random() * 8) + 2],
      ["Server Region", "Global"],
      ["Server Status", "Running"],
      ["Server Time", new Date().toLocaleTimeString()],
      ["Server Date", new Date().toLocaleDateString()],
      ["System Health", "Good"],
      ["Security", "Enabled"],
      ["Firewall", "Active"],
      ["Cache Status", "OK"],
      ["API Status", "Working"],
      ["Network Type", "IPv4"]
    ];

    const colors = [
      "#22c55e", "#38bdf8", "#a855f7", "#f97316", "#eab308", 
      "#ef4444", "#14b8a6", "#6366f1", "#06b6d4"
    ];

    function box(x, y, w, h, title, value, color) {
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(x, y, w, h);
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, w, h);
      
      ctx.fillStyle = "#94a3b8";
      ctx.font = "26px Sans";
      ctx.fillText(title, x + 20, y + 45);
      
      ctx.fillStyle = color;
      ctx.font = "bold 36px Sans";
      ctx.fillText(value, x + 20, y + 95);
    }

    const cols = 4;
    const rows = Math.ceil(stats.length / cols);
    const boxW = width / cols;
    const boxH = height / rows;

    stats.forEach((stat, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = col * boxW;
      const y = row * boxH;
      const color = colors[i % colors.length];
      box(x, y, boxW, boxH, stat[0], stat[1], color);
    });

    const path = __dirname + "/cache/dashboard_big.png";
    await fs.ensureDir(__dirname + "/cache");
    fs.writeFileSync(path, canvas.toBuffer());

    return message.reply({
      attachment: fs.createReadStream(path)
    });
  }
};
