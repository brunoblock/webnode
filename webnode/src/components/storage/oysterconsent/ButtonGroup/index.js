import React from "react";
import Radium from "radium";
import color from "color";
import { connect } from "react-redux";
import {
  CONSENT_GIVEN,
  CONSENT_DENIED
} from "../../../../redux/actions/app-actions";
class ButtonGroup extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <div style={styles.containerDesktop}>
          <li>
            {" "}
            <Button onClick={() => this.props.giveConsent()} kind="continue">
              Continue Ad-Free
            </Button>
          </li>
          <li>
            {" "}
            <Button onClick={() => this.props.denyConsent()} kind="deny">
              Deny Consent
            </Button>
          </li>
        </div>
        <div style={styles.containerMobile}>
          <Button onClick={() => this.props.giveConsent()} kind="continue">
            Continue Ad-Free
          </Button>
          <Button onClick={() => this.props.denyConsent()} kind="deny">
            Deny Consent
          </Button>
        </div>
      </div>
    );
  }
}

class Button extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <button
        onClick={this.props.onClick}
        style={[styles.base, styles[this.props.kind]]}
      >
        {this.props.children}
      </button>
    );
  }
}

Button = Radium(Button);

const styles = {
  base: {
    borderRadius: 12,
    padding: 0,
    fontFamily: "Poppins",
    fontSize: 23,
    fontWeight: 600,
    minWidth: 300,
    width: "100%",
    height: 50,
    margin: 15,
    "@media (max-width: 1200px)": {
      fontSize: 16,
      margin: 5,
      borderRadius: 8,
      height: 40,
      minWidth: 180
    }
  },

  continue: {
    background: "#088ffc",
    color: "#ffffff",
    ":hover": {
      background: color("#088ffc")
        .lighten(0.2)
        .hexString()
    },
    border: "none"
  },

  deny: {
    background: "#ffffff",
    color: "#f76868",
    borderColor: "#f76868",
    borderStyle: "solid",
    ":hover": {
      color: color("#f76868")
        .lighten(0.2)
        .hexString(),
      borderColor: color("#f76868")
        .lighten(0.2)
        .hexString()
    }
  },
  containerDesktop: {
    marginRight: 0,
    listStyleType: "none",
    width: "15%",
    minWidth: 200,
    "@media (max-width: 1200px)": {
      display: "none"
    }
  },
  containerMobile: {
    marginRight: 0,
    flexDirection: "row",
    display: "flex",
    width: "90%",
    minWidth: 200,
    "@media (min-width: 1201px)": {
      display: "none"
    }
  }
};

const mapDispatchToProps = dispatch => ({
  giveConsent: () => {
    dispatch({
      type: CONSENT_GIVEN
    });
  },
  denyConsent: () => {
    dispatch({
      type: CONSENT_DENIED
    });
  }
});

export default connect(null, mapDispatchToProps)(Radium(ButtonGroup));
