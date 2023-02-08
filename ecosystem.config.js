module.exports = {
    name: "kuriftu ticket app",
    script: "./server.js",
    max_restarts: 3, 
    max_memory_restart: "200M",
    watch: true,
    restart_delay: 3000,
}
