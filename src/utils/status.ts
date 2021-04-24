export function isRedirect(code: number | any) {
    return [ /* Alternate Data */ 666 ].includes(code) || code.toString().startsWith("3")
}