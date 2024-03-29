'use strict';

/* eslint-disable global-require */

module.exports = {
  rules: {
    'accessible-emoji': require('./rules/accessible-emoji'),
    'anchor-has-content': require('./rules/anchor-has-content'),
    'aria-activedescendant-has-tabindex': require('./rules/aria-activedescendant-has-tabindex'),
    'aria-props': require('./rules/aria-props'),
    'aria-proptypes': require('./rules/aria-proptypes'),
    'aria-role': require('./rules/aria-role'),
    'aria-unsupported-elements': require('./rules/aria-unsupported-elements'),
    'click-events-have-key-events': require('./rules/click-events-have-key-events'),
    'heading-has-content': require('./rules/heading-has-content'),
    'href-no-hash': require('./rules/href-no-hash'),
    'html-has-lang': require('./rules/html-has-lang'),
    'iframe-has-title': require('./rules/iframe-has-title'),
    'img-has-alt': require('./rules/img-has-alt'),
    'img-redundant-alt': require('./rules/img-redundant-alt'),
    'label-has-for': require('./rules/label-has-for'),
    lang: require('./rules/lang'),
    'mouse-events-have-key-events': require('./rules/mouse-events-have-key-events'),
    'no-access-key': require('./rules/no-access-key'),
    'no-autofocus': require('./rules/no-autofocus'),
    'no-distracting-elements': require('./rules/no-distracting-elements'),
    'no-onchange': require('./rules/no-onchange'),
    'no-redundant-roles': require('./rules/no-redundant-roles'),
    'no-static-element-interactions': require('./rules/no-static-element-interactions'),
    'onclick-has-focus': require('./rules/onclick-has-focus'),
    'onclick-has-role': require('./rules/onclick-has-role'),
    'role-has-required-aria-props': require('./rules/role-has-required-aria-props'),
    'role-supports-aria-props': require('./rules/role-supports-aria-props'),
    scope: require('./rules/scope'),
    'tabindex-no-positive': require('./rules/tabindex-no-positive')
  },
  configs: {
    recommended: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      rules: {
        'jsx-a11y/accessible-emoji': 'error',
        'jsx-a11y/anchor-has-content': 'error',
        'jsx-a11y/aria-activedescendant-has-tabindex': 'error',
        'jsx-a11y/aria-props': 'error',
        'jsx-a11y/aria-proptypes': 'error',
        'jsx-a11y/aria-role': 'error',
        'jsx-a11y/aria-unsupported-elements': 'error',
        'jsx-a11y/click-events-have-key-events': 'error',
        'jsx-a11y/heading-has-content': 'error',
        'jsx-a11y/href-no-hash': 'error',
        'jsx-a11y/html-has-lang': 'error',
        'jsx-a11y/iframe-has-title': 'error',
        'jsx-a11y/img-has-alt': 'error',
        'jsx-a11y/img-redundant-alt': 'error',
        'jsx-a11y/label-has-for': 'error',
        'jsx-a11y/mouse-events-have-key-events': 'error',
        'jsx-a11y/no-access-key': 'error',
        'jsx-a11y/no-autofocus': 'error',
        'jsx-a11y/no-distracting-elements': 'error',
        'jsx-a11y/no-onchange': 'error',
        'jsx-a11y/no-redundant-roles': 'error',
        'jsx-a11y/no-static-element-interactions': 'warn',
        'jsx-a11y/onclick-has-focus': 'error',
        'jsx-a11y/onclick-has-role': 'error',
        'jsx-a11y/role-has-required-aria-props': 'error',
        'jsx-a11y/role-supports-aria-props': 'error',
        'jsx-a11y/scope': 'error',
        'jsx-a11y/tabindex-no-positive': 'error'
      }
    }
  }
};