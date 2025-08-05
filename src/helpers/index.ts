export const clearUserSession = () => {
    localStorage.removeItem("token")
    // localStorage.removeItem("userData")
}