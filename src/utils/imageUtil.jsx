export const uriToFile = (id, uri) => {
    const fileExtension = uri.split('.').pop();
    const fileName = `${id}_image_${Date.now()}.${fileExtension}`;
    return  {
        uri: uri,
        type: `image/${fileExtension}`,
        name: fileName
    };
}
