/* =====================================================
   CEHO - CEK HOAKS
   Prototype JavaScript
===================================================== */


/* =====================================================
   ELEMENT HELPER
===================================================== */

const $ = (selector) => {
    return document.querySelector(selector);
};

const $$ = (selector) => {
    return document.querySelectorAll(selector);
};


/* =====================================================
   GLOBAL VARIABLE
===================================================== */

let currentType = "link";

let currentResult = null;

let history = JSON.parse(
    localStorage.getItem("cehoHistory") || "[]"
);


/* =====================================================
   CONTOH LINK
===================================================== */

const examples = [

    "https://www.tiktok.com/@contoh/video/123456789",

    "https://contoh.com/artikel/informasi-terbaru",

    "https://www.instagram.com/reel/contoh123/"

];


/* =====================================================
   CONTOH SUMBER PEMBANDING
===================================================== */

const sourceSets = [

    [

        [
            "Sumber pemeriksaan fakta A",

            "Klaim memiliki informasi yang sejalan dengan sumber pembanding.",

            "match"
        ],

        [
            "Portal berita rujukan",

            "Konteks berita mendukung bagian utama klaim.",

            "match"
        ],

        [
            "Sumber tambahan",

            "Ditemukan informasi terkait, tetapi konteks perlu diperhatikan.",

            "review"
        ]

    ],


    [

        [
            "Lembaga pemeriksa fakta",

            "Terdapat pembanding yang mendukung sebagian klaim.",

            "match"
        ],

        [
            "Media nasional",

            "Informasi utama memiliki konteks yang serupa.",

            "match"
        ],

        [
            "Artikel pembanding",

            "Sebagian detail membutuhkan pemeriksaan lanjutan.",

            "review"
        ]

    ]

];


/* =====================================================
   SCROLL KE CHECKER
===================================================== */

function goToChecker() {

    $("#checker").scrollIntoView({
        behavior: "smooth"
    });

}


/* =====================================================
   DEMO MODAL
===================================================== */

function showDemo() {

    $("#demoModal").classList.remove("hidden");

}


function closeDemo() {

    $("#demoModal").classList.add("hidden");

}


/* =====================================================
   TOAST
===================================================== */

function showToast(message) {

    const toast = $("#toast");

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2600);

}


/* =====================================================
   DARK MODE
===================================================== */

function setTheme() {

    const savedTheme =
        localStorage.getItem("cehoTheme");


    if (savedTheme === "dark") {

        document.body.classList.add("dark");

    }


    $("#themeBtn").textContent =
        document.body.classList.contains("dark")
            ? "☀"
            : "☾";

}


$("#themeBtn").addEventListener(
    "click",
    () => {

        document.body.classList.toggle("dark");


        const isDark =
            document.body.classList.contains("dark");


        localStorage.setItem(
            "cehoTheme",
            isDark
                ? "dark"
                : "light"
        );


        $("#themeBtn").textContent =
            isDark
                ? "☀"
                : "☾";

    }
);


setTheme();


/* =====================================================
   MOBILE MENU
===================================================== */

$("#mobileMenuBtn").addEventListener(
    "click",
    () => {

        const nav = $(".nav");


        if (nav.style.display === "flex") {

            nav.style.display = "";

            return;

        }


        nav.style.display = "flex";

        nav.style.position = "absolute";

        nav.style.top = "72px";

        nav.style.left = "0";

        nav.style.right = "0";

        nav.style.padding = "18px 24px";

        nav.style.background =
            "var(--surface)";

        nav.style.borderBottom =
            "1px solid var(--line)";

        nav.style.flexDirection =
            "column";

    }
);


/* =====================================================
   INPUT TABS
===================================================== */

$$(".tab").forEach((tab) => {

    tab.addEventListener(
        "click",
        () => {

            $$(".tab").forEach((item) => {

                item.classList.remove("active");

            });


            tab.classList.add("active");


            currentType =
                tab.dataset.type;


            [
                "linkBox",
                "textBox",
                "fileBox"
            ].forEach((id) => {

                $("#" + id)
                    .classList
                    .add("hidden");

            });


            $("#" + currentType + "Box")
                .classList
                .remove("hidden");

        }
    );

});


/* =====================================================
   TEXT CHARACTER COUNTER
===================================================== */

$("#textInput").addEventListener(
    "input",
    (event) => {

        $("#charCount").textContent =
            event.target.value.length;

    }
);


/* =====================================================
   FILE INPUT
===================================================== */

$("#fileInput").addEventListener(
    "change",
    (event) => {

        const file =
            event.target.files[0];


        if (!file) {
            return;
        }


        const sizeMB =
            file.size / 1024 / 1024;


        if (sizeMB > 100) {

            event.target.value = "";

            $("#fileName")
                .classList
                .add("hidden");


            showToast(
                "File melebihi batas prototype 100 MB."
            );


            return;

        }


        $("#fileName").textContent =
            `${file.name} • ${sizeMB.toFixed(1)} MB`;


        $("#fileName")
            .classList
            .remove("hidden");

    }
);


/* =====================================================
   ISI CONTOH
===================================================== */

function fillExample() {

    currentType = "link";


    $$(".tab").forEach((tab) => {

        tab.classList.toggle(
            "active",
            tab.dataset.type === "link"
        );

    });


    [
        "linkBox",
        "textBox",
        "fileBox"
    ].forEach((id) => {

        $("#" + id)
            .classList
            .add("hidden");

    });


    $("#linkBox")
        .classList
        .remove("hidden");


    $("#urlInput").value =
        examples[
        Math.floor(
            Math.random() *
            examples.length
        )
        ];


    showToast(
        "Contoh link berhasil dimasukkan."
    );

}


/* =====================================================
   VALIDASI URL
===================================================== */

function validURL(value) {

    try {

        const url =
            new URL(value);


        return (

            ["http:", "https:"]
                .includes(url.protocol)

            &&

            url.hostname.includes(".")

        );

    }

    catch {

        return false;

    }

}


/* =====================================================
   AMBIL INPUT
===================================================== */

function getInputValue() {

    /* ------------------------------
       LINK
    ------------------------------ */

    if (currentType === "link") {

        let value =
            $("#urlInput")
                .value
                .trim();


        if (!value) {

            throw new Error(
                "Masukkan link terlebih dahulu."
            );

        }


        if (
            !/^https?:\/\//i
                .test(value)
        ) {

            value =
                "https://" + value;

        }


        if (!validURL(value)) {

            throw new Error(
                "Format link belum valid."
            );

        }


        return value;

    }


    /* ------------------------------
       TEXT
    ------------------------------ */

    if (currentType === "text") {

        const value =
            $("#textInput")
                .value
                .trim();


        if (value.length < 15) {

            throw new Error(
                "Teks terlalu pendek untuk dianalisis."
            );

        }


        return value;

    }


    /* ------------------------------
       FILE
    ------------------------------ */

    const file =
        $("#fileInput")
            .files[0];


    if (!file) {

        throw new Error(
            "Pilih file audio atau video terlebih dahulu."
        );

    }


    return file.name;

}


/* =====================================================
   MULAI ANALISIS
===================================================== */

function analyzeContent() {

    let input;


    try {

        input =
            getInputValue();

    }

    catch (error) {

        showToast(
            error.message
        );

        return;

    }


    $("#analysis")
        .classList
        .remove("hidden");


    $("#result")
        .classList
        .add("hidden");


    $("#analysis")
        .scrollIntoView({
            behavior: "smooth"
        });


    /* Reset progress */

    $$(".analysis-step")
        .forEach((step) => {

            step.classList.remove(
                "active",
                "done"
            );

        });


    $("#step1")
        .classList
        .add("active");


    $("#analysisBar")
        .style
        .width = "0%";


    $("#analysisPercent")
        .textContent = "0%";


    /* Tahapan */

    const stages = [

        [
            12,
            "Memvalidasi input dan menyiapkan konten."
        ],

        [
            34,
            "Mengidentifikasi klaim atau informasi utama."
        ],

        [
            58,
            "Membandingkan klaim dengan sumber pembanding."
        ],

        [
            79,
            "Menganalisis konteks dan kecenderungan bahasa."
        ],

        [
            100,
            "Menyusun hasil pemeriksaan."
        ]

    ];


    let i = 0;


    const timer =
        setInterval(() => {

            if (i > 0) {

                $("#step" + i)
                    .classList
                    .remove("active");


                $("#step" + i)
                    .classList
                    .add("done");

            }


            const [
                percent,
                sub
            ] = stages[i];


            $("#analysisBar")
                .style
                .width =
                percent + "%";


            $("#analysisPercent")
                .textContent =
                percent + "%";


            $("#analysisSub")
                .textContent =
                sub;


            $("#step" + (i + 1))
                .classList
                .add("active");


            i++;


            if (
                i === stages.length
            ) {

                clearInterval(timer);


                setTimeout(
                    () => {

                        finishAnalysis(
                            input
                        );

                    },
                    650
                );

            }

        }, 700);

}


$("#analyzeBtn")
    .addEventListener(
        "click",
        analyzeContent
    );


/* =====================================================
   HASIL ANALISIS
===================================================== */

function finishAnalysis(input) {

    const hash = [
        ...String(input)
    ]
        .reduce(
            (a, c) =>
                (
                    a * 31 +
                    c.charCodeAt(0)
                ) >>> 0,
            7
        );


    const score =
        76 +
        (hash % 20);


    let mode;


    if (score >= 88) {

        mode = "valid";

    }

    else if (score >= 65) {

        mode = "doubt";

    }

    else {

        mode = "invalid";

    }


    const resultData = {

        id: Date.now(),

        input: input,

        type: currentType,

        score: score,

        mode: mode,

        date:
            new Date()
                .toLocaleString(
                    "id-ID"
                ),

        claim:
            currentType === "text"

                ? input.slice(
                    0,
                    155
                ) +
                (
                    input.length > 155
                        ? "..."
                        : ""
                )

                :

                "Konten mengandung klaim informasi yang perlu dibandingkan dengan sumber pembanding.",

        intent:
            score >= 85
                ? "Edukasi"
                : "Informasi",

        age:
            score >= 85
                ? "13+"
                : "17+"

    };


    currentResult =
        resultData;


    renderResult(
        resultData
    );


    $("#result")
        .classList
        .remove("hidden");


    $("#result")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =====================================================
   RENDER HASIL
===================================================== */

function renderResult(data) {

    let status;

    let desc;


    if (data.mode === "valid") {

        status =
            "Cenderung Valid";

        desc =
            "Hasil simulasi menunjukkan klaim memiliki dukungan dari sumber pembanding.";

    }

    else if (
        data.mode === "doubt"
    ) {

        status =
            "Meragukan";

        desc =
            "Sebagian informasi memiliki pembanding, tetapi konteks masih perlu diperiksa.";

    }

    else {

        status =
            "Tidak Valid";

        desc =
            "Hasil simulasi menunjukkan klaim perlu diverifikasi lebih lanjut sebelum dipercaya.";

    }


    $("#resultInput")
        .textContent =
        data.input;


    $("#verdictText")
        .textContent =
        status;


    $("#verdictDesc")
        .textContent =
        desc;


    $("#confidenceText")
        .textContent =
        data.score + "%";


    $("#confidenceBar")
        .style
        .width =
        data.score + "%";


    $("#claimText")
        .textContent =
        data.claim;


    $("#intentText")
        .textContent =
        data.intent;


    $("#ageText")
        .textContent =
        data.age;


    /* Scores */

    $("#factScore")
        .textContent =
        Math.max(
            65,
            data.score - 1
        ) + "%";


    $("#contextScore")
        .textContent =
        Math.max(
            62,
            data.score - 7
        ) + "%";


    $("#sourceScore")
        .textContent =
        Math.min(
            98,
            data.score + 4
        ) + "%";


    $("#riskScore")
        .textContent =

        data.mode === "valid"

            ? "Rendah"

            : data.mode === "doubt"

                ? "Sedang"

                : "Tinggi";


    /* Summary */

    $("#summaryText")
        .textContent =

        data.mode === "valid"

            ?

            "Konten pada prototype memiliki kecenderungan informasi yang sesuai dengan sumber pembanding. Pengguna tetap disarankan membaca sumber asli dan memahami konteks sebelum membagikannya."

            :

            "Hasil prototype menunjukkan adanya bagian yang belum cukup kuat untuk langsung dipercaya. Periksa sumber asli, tanggal publikasi, konteks, dan klaim terkait sebelum mengambil kesimpulan.";


    /* Recommendation */

    $("#recommendationText")
        .textContent =

        data.mode === "valid"

            ?

            "Informasi terlihat memiliki dukungan sumber, tetapi tetap periksa konteks dan sumber asli sebelum membagikannya."

            :

            "Jangan langsung membagikan informasi. Bandingkan klaim dengan sumber terpercaya dan periksa konteksnya.";


    /* Icon */

    const icon =
        $("#verdictIcon");


    icon.textContent =

        data.mode === "valid"

            ? "✓"

            : data.mode === "doubt"

                ? "!"

                : "×";


    if (
        data.mode === "valid"
    ) {

        icon.style.background =
            "var(--greenbg)";

        icon.style.color =
            "var(--green)";

        $("#verdictText")
            .style
            .color =
            "var(--green)";

    }

    else if (
        data.mode === "doubt"
    ) {

        icon.style.background =
            "var(--amberbg)";

        icon.style.color =
            "var(--amber)";

        $("#verdictText")
            .style
            .color =
            "var(--amber)";

    }

    else {

        icon.style.background =
            "var(--redbg)";

        icon.style.color =
            "var(--red)";

        $("#verdictText")
            .style
            .color =
            "var(--red)";

    }


    /* Sources */

    const set =
        sourceSets[
        data.score %
        sourceSets.length
        ];


    $("#sources").innerHTML =
        set.map(
            (source) => `

            <div class="source-item">

                <div>

                    <h4>
                        ${escapeHTML(source[0])}
                    </h4>

                    <p>
                        ${escapeHTML(source[1])}
                    </p>

                </div>

                <span
                    class="source-status ${source[2]}"
                >

                    ${source[2] === "match"
                    ? "Mendukung"
                    : "Perlu cek"
                }

                </span>

            </div>

        `
        ).join("");

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(str) {

    return String(str)
        .replace(
            /[&<>"']/g,
            (character) => {

                return {

                    "&": "&amp;",

                    "<": "&lt;",

                    ">": "&gt;",

                    '"': "&quot;",

                    "'": "&#039;"

                }[character];

            }
        );

}


/* =====================================================
   SIMPAN HASIL
===================================================== */

function saveCurrentResult() {

    if (!currentResult) {

        return;

    }


    const exists =
        history.some(
            (item) =>
                item.id ===
                currentResult.id
        );


    if (!exists) {

        history.unshift(
            currentResult
        );


        localStorage.setItem(
            "cehoHistory",
            JSON.stringify(
                history.slice(
                    0,
                    50
                )
            )
        );


        renderHistory();


        showToast(
            "Hasil berhasil disimpan ke riwayat."
        );

    }

    else {

        showToast(
            "Hasil ini sudah ada di riwayat."
        );

    }

}


/* =====================================================
   RENDER HISTORY
===================================================== */

function renderHistory() {

    const query =
        (
            $("#historySearch")
                ?.value ||
            ""
        ).toLowerCase();


    const filter =
        $("#historyFilter")
            ?.value ||
        "all";


    const items =
        history.filter(
            (item) => {

                const matchQuery =

                    item.input
                        .toLowerCase()
                        .includes(query)

                    ||

                    item.claim
                        .toLowerCase()
                        .includes(query);


                const matchFilter =

                    filter === "all"

                    ||

                    item.mode ===
                    filter;


                return (
                    matchQuery &&
                    matchFilter
                );

            }
        );


    if (!items.length) {

        $("#historyList")
            .innerHTML = `

                <div class="empty-history">

                    Belum ada hasil yang cocok.

                </div>

            `;

        return;

    }


    $("#historyList")
        .innerHTML =

        items
            .map(
                (item) => `

                <div class="history-item">

                    <div>

                        <h4>

                            ${item.mode === "valid"

                        ? "✓ Cenderung Valid"

                        : item.mode === "doubt"

                            ? "! Meragukan"

                            : "× Tidak Valid"

                    }

                        </h4>


                        <p>

                            ${escapeHTML(
                        item.input
                    )}

                        </p>

                    </div>


                    <div class="history-score">

                        ${item.score}%

                    </div>


                    <div class="history-date">

                        ${escapeHTML(
                        item.date
                    )}

                    </div>

                </div>

            `
            )
            .join("");

}


/* =====================================================
   HAPUS HISTORY
===================================================== */

function clearHistory() {

    if (!history.length) {

        showToast(
            "Riwayat masih kosong."
        );

        return;

    }


    if (
        !confirm(
            "Hapus semua riwayat pemeriksaan?"
        )
    ) {

        return;

    }


    history = [];


    localStorage.removeItem(
        "cehoHistory"
    );


    renderHistory();


    showToast(
        "Riwayat berhasil dihapus."
    );

}


/* =====================================================
   SEARCH HISTORY
===================================================== */

$("#historySearch")
    .addEventListener(
        "input",
        renderHistory
    );


$("#historyFilter")
    .addEventListener(
        "change",
        renderHistory
    );


/* =====================================================
   NAVIGATION OBSERVER
===================================================== */

function observeNav() {

    const sections = [
        "home",
        "checker",
        "history",
        "about"
    ];


    const links =
        $$(".nav-link");


    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(
                    (entry) => {

                        if (
                            entry.isIntersecting
                        ) {

                            links.forEach(
                                (link) => {

                                    link.classList.toggle(

                                        "active",

                                        link.getAttribute(
                                            "href"
                                        ) ===
                                        "#" +
                                        entry.target.id

                                    );

                                }
                            );

                        }

                    }
                );

            },

            {
                rootMargin:
                    "-35% 0px -55% 0px"
            }
        );


    sections.forEach(
        (id) => {

            observer.observe(
                document.getElementById(id)
            );

        }
    );

}


observeNav();


/* =====================================================
   INITIAL HISTORY
===================================================== */

renderHistory();


/* =====================================================
   ESCAPE MODAL
===================================================== */

window.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape"
        ) {

            closeDemo();

        }

    }
);
