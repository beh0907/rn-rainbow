import {useEffect, useState} from 'react';
import {Image} from 'react-native';
import PropTypes from 'prop-types';
import * as FileSystem from 'expo-file-system';
import * as Crypto from 'expo-crypto';

const FastImage = ({source, ...props}) => {
    const [uri, setUri] = useState(source.uri);

    useEffect(() => {
        (async () => {
            try {
                //이미지 uri를 SHA256 방식으로 암호화 해쉬키 리턴
                const hashed = await Crypto.digestStringAsync(
                    Crypto.CryptoDigestAlgorithm.SHA256,
                    source.uri
                )

                //캐시 저장소에 해당 키값의 경로로부터 메타데이터를 얻는다
                const fileSystemUri = `${FileSystem.cacheDirectory}${hashed}`
                const metadata = await FileSystem.getInfoAsync(fileSystemUri)

                //메타 데이터가 없을 경우 해당 경로에 캐시정보 다운로드
                if (!metadata.exists) await FileSystem.downloadAsync(source.uri, fileSystemUri)

                setUri(fileSystemUri)
            } catch (e) {
                setUri(source.uri);
            }
        })();
    }, [source.uri])

    return <Image source={{uri}} {...props} />;
};

FastImage.propTypes = {
    source: PropTypes.object.isRequired,
};

export default FastImage;
