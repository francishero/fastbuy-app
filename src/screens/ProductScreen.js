import React, { Component } from 'react';
import { Alert, Dimensions, ImageBackground, ScrollView, StyleSheet, View } from 'react-native';
import { dismissLightBox, navigatorPop, showLightBox } from './';
import { Button, KeyboardView, ImageButton, Input } from '../components';
import colors from '../colors';
import i18n from '../i18n';
import imgAppAddPhoto from '../../assets/images/app-add-photo.png';
import imgAppDelete from '../../assets/images/app-delete.png';

import ProductBusiness from '../business/ProductBusiness';


const DELETE_BUTTON_ID = 'delete';
type Props = {};
export default class ProductScreen extends Component<Props> {

  static navigatorButtons = {
    rightButtons: [{ id: DELETE_BUTTON_ID, icon: imgAppDelete }]
  };

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  state = {
    id: '',
    imageUrl: '',
    name: '',
    price: -1,
    color: '',
    size: ''
  };

  componentWillMount() {
    this.props.navigator.setTitle({ title: i18n.t('product.title') });

    const { id, imageUrl, name, price, color, size } = this.props;
    this.setState({ id, imageUrl, name, price, color, size });
  }

  onConfirmDelete() {
    showLightBox(this.props.navigator);

    ProductBusiness.deleteProduct(this.state.id)
      .then(() => {
        dismissLightBox(this.props.navigator);

        Alert.alert(
          i18n.t('app.success'),
          i18n.t('app.deleteSuccessMessage'),
          [{ text: i18n.t('app.ok'), onPress: () => navigatorPop(this.props.navigator) }],
          { cancelable: false }
        );
      })
      .catch(() => {
        dismissLightBox(this.props.navigator);

        Alert.alert(
          i18n.t('app.attention'),
          i18n.t('app.deleteFailureMessage'),
          [{ text: i18n.t('app.ok') }],
          { cancelable: true }
        );
      });
  }

  onNavigatorEvent(event) {
    if (event.type !== 'NavBarButtonPress') {
      return;
    }

    if (event.id === DELETE_BUTTON_ID) {
      this.onPressDelete();
    }
  }

  onPressAddPhoto() {
  }

  onPressSave() {
    showLightBox(this.props.navigator);

    const { id, name, price, color, size } = this.state;

    ProductBusiness.saveProduct(id, name, price, color, size)
      .then(() => {
        dismissLightBox(this.props.navigator);

        Alert.alert(
          i18n.t('app.success'),
          i18n.t('product.save.successMessage'),
          [{ text: i18n.t('app.ok'), onPress: () => navigatorPop(this.props.navigator) }],
          { cancelable: false }
        );
      })
      .catch(() => {
        dismissLightBox(this.props.navigator);

        Alert.alert(
          i18n.t('app.attention'),
          i18n.t('product.save.failureMessage'),
          [{ text: i18n.t('app.ok') }],
          { cancelable: true }
        );
      });
  }

  onPressDelete() {
    Alert.alert(
      i18n.t('app.attention'),
      i18n.t('app.deleteMessage'),
      [
        { text: i18n.t('app.deleteOk'), onPress: () => this.onConfirmDelete() },
        { text: i18n.t('app.cancel'), style: 'cancel' }
      ],
      { cancelable: true }
    );
  }

  render() {
    const { imageUrl, name, price, color, size } = this.state;

    const {
      containerStyle,
      backgroundImageStyle,
      imageButtonStyle,
      formStyle,
      subFormStyle,
      inputStyle,
      spaceViewStyle
    } = styles;

    return (
      <KeyboardView style={containerStyle}>
        <ScrollView>
          <ImageBackground style={backgroundImageStyle} source={{ uri: imageUrl }}>
            <ImageButton
              style={imageButtonStyle}
              size={45}
              source={imgAppAddPhoto}
              onPress={() => this.onPressAddPhoto()}
            />
          </ImageBackground>

          <View style={formStyle}>
            <Input
              style={inputStyle}
              title={i18n.t('product.form.product_name')}
              value={name}
              onChangeText={text => this.setState({ name: text })}
            />

            <Input
              style={inputStyle}
              title={i18n.t('product.form.price')}
              value={(price >= 0) ? `${price}` : null}
              keyboardType={'numeric'}
              onChangeText={text => this.setState({ price: text })}
            />

            <View style={subFormStyle}>
              <Input
                style={inputStyle}
                title={i18n.t('product.form.color')}
                value={color}
                onChangeText={text => this.setState({ color: text })}
              />

              <View style={spaceViewStyle} />

              <Input
                style={inputStyle}
                title={i18n.t('product.form.size')}
                value={size}
                onChangeText={text => this.setState({ size: text })}
              />
            </View>

            <Button
              backgroundColor={colors.purple}
              textColor={colors.white}
              title={i18n.t('product.form.save')}
              onPress={() => this.onPressSave()}
            />
          </View>
        </ScrollView>
      </KeyboardView>
    );
  }

}

const margin = 14;
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  containerStyle: {
    flex: 1
  },

  backgroundImageStyle: {
    backgroundColor: colors.grayLight,
    height: width * (3 / 4),
    width
  },
  imageButtonStyle: {
    position: 'absolute',
    bottom: 20,
    right: 20
  },

  formStyle: {
    margin,
  },
  subFormStyle: {
    flexDirection: 'row',
    marginBottom: margin
  },
  inputStyle: {
    flex: 1,
  },
  spaceViewStyle: {
    margin: margin / 2
  }
});