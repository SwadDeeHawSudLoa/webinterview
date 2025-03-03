// เปลี่ยนจำนวนคอลัมน์
document.getElementById("columns").addEventListener("change", function() {
    let grid = document.getElementById("gridContainer");
    grid.className = "grid-container columns-" + this.value;
});

// Auto Play การสลับภาพ
let autoPlay = false;
let index = 0;


let images = ["temple1.jpg", "temple2.jpg", "temple3.jpg", "temple4.jpg", "temple5.jpg", "temple6.jpg"];

let captions = ["ภาคเหนือ", "ภาคกลาง", "ภาคตะวันออกเฉียงเหนือ", "ภาคตะวันตก","ภาคตะวันออก","ภาคใต้"];

// ดึงรายการรูปภาพและข้อความ
let items = document.querySelectorAll(".imagewatthai2");
let textOverlays = document.querySelectorAll(".overlay");


function changeImages() {
    if (!autoPlay) return;
    items.forEach((img, i) => {
        let newIndex = (index + i) % images.length;
        img.src = images[newIndex]; // เปลี่ยนรูปภาพ
        textOverlays[i].innerText = captions[newIndex]; // เปลี่ยนข้อความ
    });
    index = (index + 1) % images.length;
}

// ตั้งค่า Interval  Auto Play
let interval = setInterval(changeImages, 3000);

// ควบคุม Auto Play จาก Dropdown
document.getElementById("autoplay").addEventListener("change", function() {
    autoPlay = this.value === "true";
    if (autoPlay) {
        interval = setInterval(changeImages, 3000);
    } else {
        clearInterval(interval);
    }
});
