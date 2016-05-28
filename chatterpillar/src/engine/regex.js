/**
 * This module stores common regular expressions used in parsing a message in
 *     conversation.
 * @type {Object}
 */
module.exports = {
  num_range: /(\d-\d)|(\b(one|two|three|four|five|six|seven|eight|nine|ten|\d)( (to|or|maybe|-) )?\b(one|two|three|four|five|six|seven|eight|nine|ten|\d)?)|(\d)/ig,
  price: /\d{1,9}(?:[. ,]\d{3})*(?:[. ,]\d{2})?/ig,
  no: /(\b)n([o]|\b)([ph]|\b)(e|\b)|never|nah|I don't/ig,
  yes: /(\b)y([eaui .]|\b)([eaphs .]|\b)([ahs .]|\b)|(sure|\bright|fo shizzle|absolutely|totally|totes)|(\bok)/ig,
  house_apt: /house|apartment|apt|entire/ig,
  individual_room: /\broom|individual/ig
};
