(() => {
    "use strict";

    const backgroundLayer = document.getElementById(
        "automation-background"
    );

    if (!backgroundLayer) {
        console.warn(
            "The automation background element was not found."
        );

        return;
    }

    const reducedMotionPreference = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    const automationEmojis = [
        "🤖",
        "⚙️",
        "💻",
        "🧠",
        "🔁",
        "📊",
        "🛠️",
        "🔗",
        "🧩",
        "🚀",
        "📡",
        "🗄️",
        "☁️",
        "💡",
        "🔐",
        "🧪",
        "📱",
        "⌨️",
        "🌐",
        "📦"
    ];

    /*
    Maximum number of emojis visible at one time.
    Reduce this value if you want fewer emojis.
    */

    const MAX_VISIBLE_EMOJIS = 12;

    /*
    Time between new emojis in milliseconds.
    Increase this value to make emojis appear less frequently.
    */

    const SPAWN_INTERVAL = 1800;

    /*
    Number of emojis created when the page initially loads.
    */

    const INITIAL_EMOJI_COUNT = 7;

    let spawnIntervalId = null;
    let initialTimeoutIds = [];

    function randomBetween(minimum, maximum) {
        return (
            Math.random() * (maximum - minimum) +
            minimum
        );
    }

    function getRandomAutomationEmoji() {
        const randomIndex = Math.floor(
            Math.random() * automationEmojis.length
        );

        return automationEmojis[randomIndex];
    }

    function createAutomationEmoji() {
        if (
            reducedMotionPreference.matches ||
            document.hidden ||
            backgroundLayer.childElementCount >=
                MAX_VISIBLE_EMOJIS
        ) {
            return;
        }

        const emojiElement = document.createElement("span");

        const startX = randomBetween(-5, 95);

        const horizontalMovement = randomBetween(
            -20,
            20
        );

        const endX = startX + horizontalMovement;

        const animationDuration = randomBetween(
            15,
            26
        );

        const animationDelay = randomBetween(
            0,
            1.5
        );

        const scale = randomBetween(
            0.8,
            1.4
        );

        const opacity = randomBetween(
            0.38,
            0.68
        );

        const rotation = randomBetween(
            -260,
            260
        );

        const fontSize = randomBetween(
            25,
            44
        );

        emojiElement.className = "automation-emoji";

        emojiElement.textContent =
            getRandomAutomationEmoji();

        emojiElement.setAttribute(
            "aria-hidden",
            "true"
        );

        emojiElement.style.setProperty(
            "--start-x",
            `${startX}vw`
        );

        emojiElement.style.setProperty(
            "--end-x",
            `${endX}vw`
        );

        emojiElement.style.setProperty(
            "--scale",
            scale.toFixed(2)
        );

        emojiElement.style.setProperty(
            "--opacity",
            opacity.toFixed(2)
        );

        emojiElement.style.setProperty(
            "--rotation",
            `${rotation.toFixed(0)}deg`
        );

        emojiElement.style.fontSize =
            `${fontSize.toFixed(0)}px`;

        emojiElement.style.animationDuration =
            `${animationDuration.toFixed(2)}s`;

        emojiElement.style.animationDelay =
            `${animationDelay.toFixed(2)}s`;

        /*
        Keep every generated emoji non-interactive.
        */

        emojiElement.style.pointerEvents = "none";

        backgroundLayer.appendChild(emojiElement);

        emojiElement.addEventListener(
            "animationend",
            () => {
                emojiElement.remove();
            },
            {
                once: true
            }
        );
    }

    function clearInitialTimeouts() {
        initialTimeoutIds.forEach(
            (timeoutId) => {
                window.clearTimeout(timeoutId);
            }
        );

        initialTimeoutIds = [];
    }

    function createInitialEmojis() {
        clearInitialTimeouts();

        for (
            let index = 0;
            index < INITIAL_EMOJI_COUNT;
            index += 1
        ) {
            const timeoutId = window.setTimeout(
                createAutomationEmoji,
                index * 500
            );

            initialTimeoutIds.push(timeoutId);
        }
    }

    function stopAnimation() {
        if (spawnIntervalId !== null) {
            window.clearInterval(
                spawnIntervalId
            );

            spawnIntervalId = null;
        }

        clearInitialTimeouts();
    }

    function clearAllEmojis() {
        backgroundLayer.replaceChildren();
    }

    function startAnimation() {
        stopAnimation();

        if (reducedMotionPreference.matches) {
            clearAllEmojis();
            return;
        }

        createInitialEmojis();

        spawnIntervalId = window.setInterval(
            createAutomationEmoji,
            SPAWN_INTERVAL
        );
    }

    document.addEventListener(
        "visibilitychange",
        () => {
            if (document.hidden) {
                stopAnimation();
            } else {
                startAnimation();
            }
        }
    );

    window.addEventListener(
        "beforeunload",
        stopAnimation
    );

    if (
        typeof reducedMotionPreference
            .addEventListener === "function"
    ) {
        reducedMotionPreference.addEventListener(
            "change",
            startAnimation
        );
    } else {
        reducedMotionPreference.addListener(
            startAnimation
        );
    }

    startAnimation();
})();
