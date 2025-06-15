export default function isMobile(){
    const screen = window.innerWidth;
    if (screen > 800) {
        return false
    } else {
        return true
    }
}