const PROXY_CONFIG = [
    {
        context: [            
            "/greeting",
            "/zonetag",
            "/zonetagts",
            "/socket",
            "/socket/app/message",
            "/topic/reply",
            "/app/message"
        ],
        target: "http://visusjapat4hubd:8080",
        secure: false
    }
]

module.exports = PROXY_CONFIG;