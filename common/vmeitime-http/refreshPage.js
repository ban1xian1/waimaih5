export function refreshPage() {
    const pages = getCurrentPages(); // 获取当前页面栈
    const currentPage = pages[pages.length - 1]; // 获取当前页面

    if (currentPage && currentPage.onLoad) {
        currentPage.onLoad(currentPage.options); // 调用 onLoad 刷新页面
    }
}