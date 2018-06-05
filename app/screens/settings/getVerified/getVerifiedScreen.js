import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { refreshGetVerified } from './../../../redux/actions';

import Header from './../../../components/header';
import GetVerifiedOption from './../../../components/getVerifiedOption';
import HeaderVerified from './../../../components/HeaderVerified';

import { Spinner, InputContainer } from './../../../components/common';

class GetVerifiedScreen extends Component {
  static navigationOptions = {
    title: 'Get verified',
  };

  componentDidMount() {
    this.props.refreshGetVerified();
  }

  goTo = (path, name) => {
    this.props.navigation.navigate(path, { name });
  };

  renderBasicInfo() {
    const { profile } = this.props;

    let value = profile.first_name + ' ' + profile.last_name;
    let status = profile.status.toUpperCase();

    return (
      <GetVerifiedOption
        label="Basic Info"
        value={value}
        status={status}
        gotoAddress="SettingsPersonalDetails"
        goTo={this.goTo}
      />
    );
  }

  renderEmailAddresses() {
    const { email_address } = this.props;

    let value = 'Not yet provided';
    let status = 'INCOMPLETE';

    for (let i = 0; i < email_address.length; i++) {
      if (email_address[i].verified === true) {
        status = 'VERIFIED';
        value = email_address[i].email;
      }
      if (email_address[i].primary === true) {
        value = email_address[i].email;
      }
    }

    return (
      <GetVerifiedOption
        label="Email address"
        value={value}
        status={status}
        gotoAddress="SettingsEmailAddresses"
        goTo={this.goTo}
      />
    );
  }

  renderMobileNumbers() {
    const { mobile_number } = this.props;

    let value = 'Not yet provided';
    let status = 'INCOMPLETE';

    for (let i = 0; i < mobile_number.length; i++) {
      if (mobile_number[i].verified) {
        status = 'VERIFIED';
        value = mobile_number[i].number;
      }
      if (mobile_number[i].primary) {
        value = mobile_number[i].number;
      }
    }

    return (
      <GetVerifiedOption
        label="Mobile number"
        value={value}
        status={status}
        gotoAddress="SettingsMobileNumbers"
        goTo={this.goTo}
      />
    );
  }

  renderAddresses() {
    const { address } = this.props;

    let value = '';
    if (address.line_1) {
      value = value + address.line_1 + ', ';
    }
    if (address.line_2) {
      value = value + address.line_2 + ', ';
    }
    if (address.city) {
      value = value + address.city + ', ';
    }
    if (address.state_province) {
      value = value + address.state_province + ', ';
    }
    if (address.country) {
      value = value + address.country + ', ';
    }
    if (address.postal_code) {
      value = value + address.postal_code;
    }
    let status = address.status.toUpperCase();

    return (
      <GetVerifiedOption
        label="Address"
        value={value}
        status={status}
        gotoAddress="SettingsAddress"
        goTo={this.goTo}
      />
    );
  }

  renderDocuments() {
    const { document } = this.props;

    let valueIdentity = 'Not yet provided';
    let statusIdentity = 'INCOMPLETE';
    let idDocuments = document.filter(
      doc => doc.document_category === 'Proof Of Identity',
    );
    let idVerified = idDocuments.filter(doc => doc.status === 'verified');
    let idPending = idDocuments.filter(doc => doc.status === 'pending');
    let idDenied = idDocuments.filter(doc => doc.status === 'denied');
    if (idVerified.length > 0) {
      statusIdentity = 'verified';
      valueIdentity = 'Verified';
    } else if (idPending.length > 0) {
      statusIdentity = 'pending';
      valueIdentity = 'Waiting for approval';
    } else if (idDenied.length) {
      statusIdentity = 'denied';
      valueIdentity = idDenied[0].note;
    }

    let valueAdvancedIdentity = 'Not yet provided';
    let statusAdvancedIdentity = 'INCOMPLETE';
    let idSelfieDocuments = document.filter(
      doc => doc.document_category === 'Advanced Proof Of Identity',
    );
    let idSelfieVerified = idSelfieDocuments.filter(
      doc => doc.status === 'verified',
    );
    let idSelfiePending = idSelfieDocuments.filter(
      doc => doc.status === 'pending',
    );
    let idSelfieDenied = idSelfieDocuments.filter(
      doc => doc.status === 'denied',
    );
    if (idSelfieVerified.length > 0) {
      statusAdvancedIdentity = 'verified';
      valueAdvancedIdentity = 'Verified';
    } else if (idSelfiePending.length > 0) {
      statusAdvancedIdentity = 'pending';
      valueAdvancedIdentity = 'Waiting for approval';
    } else if (idSelfieDenied.length > 0) {
      statusAdvancedIdentity = 'denied';
      valueAdvancedIdentity = idSelfieDenied[0].note;
    }

    let valueAddress = 'Not yet provided';
    let statusAddress = 'INCOMPLETE';
    let addressDocuments = document.filter(
      doc => doc.document_category === 'Proof Of Address',
    );
    let addressVerified = addressDocuments.filter(
      doc => doc.status === 'verified',
    );
    let addressPending = addressDocuments.filter(
      doc => doc.status === 'pending',
    );
    let addressDenied = addressDocuments.filter(doc => doc.status === 'denied');
    if (addressVerified.length > 0) {
      statusAddress = 'verified';
      valueAddress = 'Verified';
    } else if (addressPending.length > 0) {
      statusAddress = 'pending';
      valueAddress = 'Waiting for approval';
    } else if (addressDenied.length > 0) {
      statusAddress = 'denied';
      valueAddress = idDenied[0].note;
    }

    return (
      <View>
        <GetVerifiedOption
          label="Proof of Identity"
          value={valueIdentity}
          status={statusIdentity.toUpperCase()}
          gotoAddress="Document"
          goTo={this.goTo}
        />

        <GetVerifiedOption
          label="Advanced Proof of Identity"
          value={valueAdvancedIdentity}
          status={statusAdvancedIdentity.toUpperCase()}
          gotoAddress="Document"
          goTo={this.goTo}
        />

        <GetVerifiedOption
          label="Proof of Address"
          value={valueAddress}
          status={statusAddress.toUpperCase()}
          gotoAddress="Document"
          goTo={this.goTo}
        />
      </View>
    );
  }

  render() {
    const { profile, loading_profile } = this.props;
    const { container, mainContainer } = styles;
    return (
      <View style={container}>
        <Header
          navigation={this.props.navigation}
          drawer
          title="Get verified"
        />
        <HeaderVerified
          photoLink={profile.profile}
          name={
            profile.first_name
              ? profile.first_name + ' ' + profile.last_name
              : profile.username
          }
        />
        <View style={mainContainer}>
          {loading_profile ? <Spinner /> : null}
          <InputContainer>
            {this.renderBasicInfo()}
            {this.renderEmailAddresses()}
            {this.renderMobileNumbers()}
            {this.renderAddresses()}
            {this.renderDocuments()}
          </InputContainer>
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  mainContainer: {
    flex: 1,
  },
};

const mapStateToProps = ({ user }) => {
  const {
    profile,
    address,
    mobile_number,
    email_address,
    document,
    loading_profile,
  } = user;
  return {
    profile,
    address,
    mobile_number,
    email_address,
    document,
    loading_profile,
  };
};

export default connect(mapStateToProps, { refreshGetVerified })(
  GetVerifiedScreen,
);
