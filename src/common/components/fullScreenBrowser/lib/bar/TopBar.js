import React from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';

import { BarContainer } from './BarContainer';
import BackNarrowIcon from 'react-native-vector-icons/MaterialIcons';
import {getStatusBarHeight} from './StatusBarHeightUitl'


export default class TopBar extends React.Component {

  static propTypes = {
    displayed: PropTypes.bool,
    title: PropTypes.string,
    height: PropTypes.number,
    onBack: PropTypes.func,
  };

  static defaultProps = {
    displayed: false,
    title: ''
  };

  renderBackButton() {
    const { onBack } = this.props;

    // do not display back button if there isn't a press handler
    if (onBack) {
      return (
        <TouchableOpacity style={styles.backContainer} onPress={onBack}>
          <BackNarrowIcon
              name='arrow-back'
              size={30}
              color='#F5FBFF' light/>
        </TouchableOpacity>
      );
    }

    return null;
  }

  render() {
    const {
      displayed,
      title,
      height,
    } = this.props;

    return (
      <BarContainer
        style={styles.container}
        displayed={displayed}
        height={height}
      >
        {this.renderBackButton()}
        <Text style={styles.text}>{title}</Text>
      </BarContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: getStatusBarHeight()
  },
  text: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center',
  },
  backContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    left: 10,
    height: 40
  },
});
