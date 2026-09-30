export function downloadUrl(filename: string, url: string): void {
  const link = document.createElement('a')
  link.download = filename
  link.href = url
  link.click()
}

export function downloadText(filename: string, text: string, type: string): void {
  const url = URL.createObjectURL(new Blob([text], { type }))
  downloadUrl(filename, url)
  URL.revokeObjectURL(url)
}
