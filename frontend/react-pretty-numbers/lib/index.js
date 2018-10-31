'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _numeric_label = require('./component/numeric_label');

var _numeric_label2 = _interopRequireDefault(_numeric_label);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_Component) {
  _inherits(App, _Component);

  function App(props) {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(App).call(this, props));
  }

  _createClass(App, [{
    key: 'render',
    value: function render() {
      var option = {
        'justification': 'L',
        'locales': 'en-US',
        'currency': true,
        'currencyIndicator': 'USD',
        'percentage': false,
        'precision': 2,
        'wholenumber': null,
        'commafy': true,
        'cssClass': ['red'],
        'shortFormat': true,
        'shortFormatMinValue': 100000,
        'shortFormatPrecision': 1,
        'title': true
      };

      var option2 = {
        'justification': 'C',
        'locales': 'en-US',
        'currency': false,
        'currencyIndicator': 'USD',
        'percentage': true,
        'precision': 0,
        'wholenumber': null,
        'commafy': true,
        'shortFormat': true,
        'title': 'some title'
      };

      var option3 = {
        'justification': 'R',
        'locales': 'uk-UA',
        'currency': false,
        'currencyIndicator': 'UAH',
        'percentage': true,
        'precision': 1,
        'wholenumber': false,
        'commafy': true,
        'shortFormat': false
      };

      return _react2.default.createElement(
        'div',
        { className: 'numeric-wrapper' },
        _react2.default.createElement(
          'h2',
          null,
          'Numeric Lable Component'
        ),
        _react2.default.createElement(
          _numeric_label2.default,
          { params: option },
          '1243.2155'
        ),
        _react2.default.createElement('br', null),
        _react2.default.createElement(
          _numeric_label2.default,
          { params: option },
          '31243.2155'
        ),
        _react2.default.createElement('br', null),
        _react2.default.createElement(
          _numeric_label2.default,
          { params: option },
          '631243.2155'
        ),
        _react2.default.createElement('br', null),
        _react2.default.createElement(
          _numeric_label2.default,
          { params: option },
          '7631243.2155'
        ),
        _react2.default.createElement('br', null),
        _react2.default.createElement(
          _numeric_label2.default,
          { params: option },
          '77631243.2155'
        ),
        _react2.default.createElement('br', null),
        _react2.default.createElement(
          _numeric_label2.default,
          { params: option2 },
          '977631243.2155'
        ),
        _react2.default.createElement('br', null),
        _react2.default.createElement(
          _numeric_label2.default,
          { params: option2 },
          '9977631243.2155'
        ),
        _react2.default.createElement('br', null),
        _react2.default.createElement(
          _numeric_label2.default,
          { params: option },
          '19977631243.2155'
        ),
        _react2.default.createElement('br', null),
        _react2.default.createElement(
          _numeric_label2.default,
          { params: option },
          '119977631243.2155'
        ),
        _react2.default.createElement('br', null),
        _react2.default.createElement(
          _numeric_label2.default,
          { params: option },
          '5119977631243.2155'
        ),
        _react2.default.createElement('br', null),
        _react2.default.createElement(
          _numeric_label2.default,
          { params: option },
          '75119977631243.2155'
        ),
        _react2.default.createElement('br', null),
        _react2.default.createElement(
          _numeric_label2.default,
          { params: option },
          '975119977631243.2155'
        ),
        _react2.default.createElement('br', null),
        _react2.default.createElement(
          _numeric_label2.default,
          { params: option },
          '2975119977631243.2155'
        ),
        _react2.default.createElement('br', null),
        _react2.default.createElement(
          _numeric_label2.default,
          { params: option },
          '12975119977631243.2155'
        ),
        _react2.default.createElement('br', null),
        _react2.default.createElement(
          _numeric_label2.default,
          { params: option },
          '112975119977631243.2155'
        ),
        _react2.default.createElement('br', null),
        _react2.default.createElement(
          _numeric_label2.default,
          { params: option },
          '1112975119977631243.2155'
        ),
        _react2.default.createElement('br', null),
        _react2.default.createElement(
          _numeric_label2.default,
          { params: option3 },
          '21112975119977631243.2155'
        ),
        _react2.default.createElement('br', null),
        _react2.default.createElement(
          _numeric_label2.default,
          { params: option3 },
          '321112975119977631243.2155'
        ),
        _react2.default.createElement('br', null),
        _react2.default.createElement(
          _numeric_label2.default,
          { params: option },
          '6321112975119977631243.2155'
        ),
        _react2.default.createElement('br', null),
        _react2.default.createElement(
          _numeric_label2.default,
          { params: option },
          'Some text'
        ),
        _react2.default.createElement('br', null),
        _react2.default.createElement(
          _numeric_label2.default,
          { params: option },
          '2e10'
        ),
        _react2.default.createElement('br', null),
        _react2.default.createElement(
          _numeric_label2.default,
          { params: option },
          '.4'
        ),
        _react2.default.createElement('br', null),
        _react2.default.createElement(_numeric_label2.default, { params: option }),
        _react2.default.createElement('br', null),
        _react2.default.createElement(
          _numeric_label2.default,
          null,
          '123'
        )
      );
    }
  }]);

  return App;
}(_react.Component);

_reactDom2.default.render(_react2.default.createElement(App, null), document.querySelector('.container'));
module.hot.accept();