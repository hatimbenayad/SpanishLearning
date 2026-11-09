module.exports = {
  Platform: {
    OS: 'ios',
    select: (obj) => (obj.ios !== undefined ? obj.ios : obj.default),
  },
  StyleSheet: {
    create: (styles) => styles,
  },
  Text: 'Text',
  View: 'View',
  Pressable: 'Pressable',
  ScrollView: 'ScrollView',
  SafeAreaView: 'SafeAreaView',
  TextInput: 'TextInput',
  Modal: 'Modal',
  StatusBar: {
    currentHeight: 24,
  },
};

