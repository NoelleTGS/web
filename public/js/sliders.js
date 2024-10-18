sliders();
function sliders() {

    const names = ["sr", "bpm", "len", "year", "ar", "cs", "od", "hp"];
    const labels = [];
    const sliders = [];

    names.forEach(name => {
        sliders.push([
            document.getElementById(`${name}_min_slider`),
            document.getElementById(`${name}_max_slider`)
        ]);
        labels.push([
            document.getElementById(`${name}_min_label`),
            document.getElementById(`${name}_max_label`)
        ]);
    })

    for (let i = 0; i < sliders.length; i++) {
        moveSlider(sliders[i][0], labels[i][0], sliders[i][1], "min");
        moveSlider(sliders[i][1], labels[i][1], sliders[i][0], "max");
    }

    function moveSlider(slider, label, other, name) {
        slider.addEventListener("input", function () {
            const val = Number(this.value);
            let txt = val;
            if (name === "min") {
                if (val >= Number(other.value)) {
                    this.value = Number(other.value) - Number(this.step);
                    return;
                }
            } else if (name === "max") {
                if (val <= Number(other.value)) {
                    this.value = Number(other.value) + Number(this.step);
                    return;
                }
            }
            if (slider.id.includes("len")) {
                txt = secondsToTime(val);
            }
            if (val >= slider.max) {
                slider.value = slider.max;
                if (slider.id.includes("year")) {
                    txt = "now";
                } else {
                    txt = '∞';
                }
            }
            label.innerText = txt;
        });
    }

}
