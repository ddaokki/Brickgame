$(document).ready(function() {
    const elementsToHide = [
        "#browser_header_logo",
        ".languages",
        ".utillmenu",
        "#gnb",
        "#lnb h2",
        ".course-subject",
        ".select-subject",
        ".class-time",
        "#lnb-menu",
        "#content-location",
        "#report-list"
    ];

    let currentIndex = 0;

    const hideElement = () => {
        if (currentIndex < elementsToHide.length) {
            $(elementsToHide[currentIndex]).css("display", "none");
            currentIndex++;
        } else {
            clearInterval(hideInterval);
            $("link[href='mystyle.css']").remove();

            window.location.href = "gameSuccessFinal.html";
        }
    };

    const hideInterval = setInterval(hideElement, 700);
});