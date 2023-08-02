import { Pressable } from 'react-native';
import PropTypes from 'prop-types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PRIMARY } from '../../Colors';

const HeaderRight = ({ onPress, name, color }) => {
    return (
        <Pressable hitSlop={10} onPress={onPress}>
            <MaterialCommunityIcons
                name={name}
                size={24}
                color={color}
            />
        </Pressable>
    );
};

HeaderRight.defaultProps = {
    color: PRIMARY.DEFAULT
};

HeaderRight.propTypes = {
    onPress: PropTypes.func,
    name: PropTypes.string.isRequired,
    color: PropTypes.string,
};

export default HeaderRight;
