/**
 * 使用社区版弹窗，或自动回退到使用confirm。  
 * 使用社区版弹窗时，返回结果是异步的，因此需要在前面添加await。  
 */
export function myConfirm(title: string, message: string) {
    if (typeof self.clipAlert === 'function')
        return self.clipAlert(title, message) // 异步
    return confirm(message) // 同步
}