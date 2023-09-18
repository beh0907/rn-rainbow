import { Pressable } from 'react-native';
import PropTypes from 'prop-types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PRIMARY } from '../../Colors';

const HeaderRight = ({ onPress, name, color, disabled }) => {
    return (
        <Pressable hitSlop={10} onPress={onPress} disabled={disabled}>
            <MaterialCommunityIcons
                name={name}
                size={24}
                color={color}
            />
        </Pressable>
    );
};

HeaderRight.defaultProps = {
    color: PRIMARY.DEFAULT,
    disabled: true,
};

HeaderRight.propTypes = {
    onPress: PropTypes.func,
    name: PropTypes.string.isRequired,
    color: PropTypes.string,
    disabled: PropTypes.bool,
};

export default HeaderRight;
