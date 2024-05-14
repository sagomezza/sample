export const getExtention = (file: string) => {
    let base64 = file.split(';')
    base64 = base64[0].split('/')
    let ext = base64[1]
    console.log(ext)
    if (ext === 'jpg') return '.jpg'
    else if (ext === 'png') return '.png'
    else if (ext === 'gif') return '.gif'
    else if (ext === 'webp') return '.webp'
    else return ''
}