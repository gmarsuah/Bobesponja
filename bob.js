function moveArms(position) {
    let leftArm = document.querySelector('.arm.left');
    let rightArm = document.querySelector('.arm.right');
    let leftMiddleArm = document.querySelector('.arm.middle.left');
    let rightMiddleArm = document.querySelector('.arm.middle.right');
    
    if (position === 'middle') {
        leftArm.style.display = 'none';
        rightArm.style.display = 'none';
        leftMiddleArm.style.display = 'block';
        rightMiddleArm.style.display = 'block';
    } else if (position === 'up') {
        leftArm.style.display = 'block';
        rightArm.style.display = 'block';
        leftMiddleArm.style.display = 'none';
        rightMiddleArm.style.display = 'none';
        leftArm.style.transform = 'rotate(180deg)';
        rightArm.style.transform = 'rotate(-180deg)';
    } else {
        leftArm.style.display = 'block';
        rightArm.style.display = 'block';
        leftMiddleArm.style.display = 'none';
        rightMiddleArm.style.display = 'none';
        leftArm.style.transform = 'rotate(0deg)';
        rightArm.style.transform = 'rotate(0deg)';
    }
}
function movePupils(position) {
    let pupils = document.querySelectorAll('.pupil');
    let offsets = {
        'left': '10%',
        'mid-left': '30%',
        'center': '50%',
        'mid-right': '70%',
        'right': '90%'
    };
    pupils.forEach(pupil => {
        pupil.style.left = offsets[position];
    });
}