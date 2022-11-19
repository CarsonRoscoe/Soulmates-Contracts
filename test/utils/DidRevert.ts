export async function didRevert(anyPromise: any) {
    let pass = false
    try {
        await anyPromise()
    } catch (e) {
        pass = true
    }
    return pass
}
