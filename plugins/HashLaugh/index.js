(() => {
    const { patcher, metro } = vendetta;

    const MessageActions = metro.findByProps("sendMessage");
    if (!MessageActions?.sendMessage) return;

    const EMOTES = [
        "🤪",
        "🥺",
        "😭✌️",
        "🤪🫵",
        "🤣",
        "😁",
        "🤣👈",
        "😅",
        "😭",
        "😭🙏",
        "=))=))"
    ];

    let targetUserIds = [];

    function getRandomEmote() {
        // 30% có emote, 70% không có
        if (Math.random() >= 0.0)
            return "";

        return EMOTES[Math.floor(Math.random() * EMOTES.length)];
    }

    patcher.before("sendMessage", MessageActions, (args) => {
        const message = args?.[1];

        if (!message?.content)
            return;

        let content = message.content;

        /*
         * =========================
         * AUTO MENTION
         * =========================
         */

        const mentions = [
            ...content.matchAll(/<@!?(\d+)>/g)
        ];

        // Nếu tin nhắn hiện tại có mention mới,
        // thay toàn bộ target cũ bằng target mới.
        if (mentions.length > 0) {
            targetUserIds = [
                ...new Set(
                    mentions.map(match => match[1])
                )
            ];

            // Xóa mention khỏi vị trí ban đầu
            content = content
                .replace(/<@!?\d+>/g, "")
                .replace(/\s+/g, " ")
                .trim();
        }

        // Tự động thêm các target đã lưu vào cuối
        if (targetUserIds.length > 0) {
            const targets = targetUserIds
                .map(id => `<@${id}>`)
                .join(" ");

            content = `${content} ${targets}`.trim();
        }

        /*
         * =========================
         * # PREFIX
         * =========================
         */

        // Xóa # ở đầu nếu đã có để tránh ## / # #
        content = content
            .replace(/^#\s*/g, "")
            .trim();

        content = "# " + content;

        /*
         * =========================
         * RANDOM EMOTE
         * =========================
         */

        const emote = getRandomEmote();

        if (emote) {
            content += " " + emote;
        }

        message.content = content;
    });
})();
