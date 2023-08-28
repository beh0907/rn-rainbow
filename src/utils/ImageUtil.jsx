export const uriToImageFile = (id, uri) => {
    const fileExtension = uri.split('.').pop();
    const fileName = `${id}_image_${Date.now()}.${fileExtension}`;
    return  {
        uri: uri,
        type: `image/${fileExtension}`,
        name: fileName
    };
}

export const uriToVideoFile = (id, uri) => {
    const fileExtension = uri.split('.').pop();
    const fileName = `${id}_video_${Date.now()}.${fileExtension}`;
    return  {
        uri: uri,
        type: `video/${fileExtension}`,
        name: fileName
    };
}
