import React from 'react';
import ReactMarkdown from 'react-markdown';
import i18next from 'i18next';
import backend from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';
import moment from 'moment';

import ls from './localStorage';
import { stringToIcons } from './destinyUtils';
import { markdownHelper_link, markdownHelper_listItem, wrapEnergy, noParagraphs } from './markdown';

let _defaultLanguage = 'en';
let _currentLanguage;

function getCurrentLanguage() {
  if (_currentLanguage) return _currentLanguage;

  _currentLanguage = ls.get('setting.language');

  return _currentLanguage || _defaultLanguage;
}

function setCurrentLanguage(lang) {
  _currentLanguage = lang;

  ls.set('setting.language', lang);
}

i18next
  .use(backend)
  .use(initReactI18next)
  .init({
    lng: getCurrentLanguage(),
    fallbackLng: _defaultLanguage,
    backend: {
      loadPath: '/static/locales/{{lng}}/{{ns}}.json',
    },
    // allow keys to be phrases having `:`, `.`
    nsSeparator: false,
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      wait: true,
      useSuspense: true,
    },
  });

i18next.getCurrentLanguage = getCurrentLanguage;
i18next.setCurrentLanguage = setCurrentLanguage;

export default i18next;

export const t = (key, options) => i18next.t(key, options || { skipInterpolation: true });

export function getLanguageInfo(code) {
  switch (code) {
    case 'debug':
      return {
        name: 'Debug',
        code: code,
      };
    case 'de':
      return {
        name: 'Deutsch',
        code: code,
      };
    case 'en':
      return {
        name: 'English',
        code: code,
      };
    case 'en-au':
      return {
        name: 'English (Australia)',
        code: code,
      };
    case 'es':
      return {
        name: 'Español (España)',
        code: code,
      };
    case 'es-mx':
      return {
        name: 'Español (Latinoamérica)',
        code: code,
      };
    case 'fr':
      return {
        name: 'Français',
        code: code,
      };
    case 'it':
      return {
        name: 'Italiano',
        code: code,
      };
    case 'ja':
      return {
        name: '日本語',
        code: code,
      };
    case 'ko':
      return {
        name: '한국어',
        code: code,
      };
    case 'pl':
      return {
        name: 'Polski',
        code: code,
      };
    case 'pt-br':
      return {
        name: 'Português Brasileiro',
        code: code,
      };
    case 'ru':
      return {
        name: 'Русский',
        code: code,
      };
    case 'zh-cht':
      return {
        name: '繁體中文',
        code: code,
      };
    case 'zh-chs':
      return {
        name: '简体中文',
        code: code,
      };
    default:
      return { code: code };
  }
}

const durationKeys = {
  years: {
    single: () => t('Language.Time.Years.Singluar'),
    plural: (years) => t('Language.Time.Years.Plural', { years }),
  },
  months: {
    single: () => t('Language.Time.Months.Singluar'),
    plural: (months) => t('Language.Time.Months.Plural', { months }),
  },
  days: {
    single: () => t('Language.Time.Days.Singluar'),
    plural: (days) => t('Language.Time.Days.Plural', { days }),
  },
  hours: {
    single: () => t('Language.Time.Hours.Singluar'),
    plural: (hours) => t('Language.Time.Hours.Plural', { hours }),
  },
  minutes: {
    single: () => t('Language.Time.Minutes.Singluar'),
    plural: (minutes) => t('Language.Time.Minutes.Plural', { minutes }),
  },
  seconds: {
    single: () => t('Language.Time.Seconds.Singluar'),
    plural: (seconds) => t('Language.Time.Seconds.Plural', { seconds }),
  },
};

const durationKeysAbr = {
  years: {
    single: () => t('Language.Time.Years.Singluar.Abbr'),
    plural: (years) => t('Language.Time.Years.Plural.Abbr', { years }),
  },
  months: {
    single: () => t('Language.Time.Months.Singluar.Abbr'),
    plural: (months) => t('Language.Time.Months.Plural.Abbr', { months }),
  },
  days: {
    single: () => t('Language.Time.Days.Singluar.Abbr'),
    plural: (days) => t('Language.Time.Days.Plural.Abbr', { days }),
  },
  hours: {
    single: () => t('Language.Time.Hours.Singluar.Abbr'),
    plural: (hours) => t('Language.Time.Hours.Plural.Abbr', { hours }),
  },
  minutes: {
    single: () => t('Language.Time.Minutes.Singluar.Abbr'),
    plural: (minutes) => t('Language.Time.Minutes.Plural.Abbr', { minutes }),
  },
  seconds: {
    single: () => t('Language.Time.Seconds.Singluar.Abbr'),
    plural: (seconds) => t('Language.Time.Seconds.Plural.Abbr', { seconds }),
  },
};

function finalString(value) {
  return value.toLocaleString();
}

export const duration = ({ years = 0, months = 0, days = 0, hours = 0, minutes = 0, seconds = 0 }, { unit = undefined, relative = false, abbreviated = false, round = false } = {}) => {
  const string = [];

  const keys = abbreviated ? durationKeysAbr : durationKeys;

  if (relative) {
    if (round) {
      if (months > 6 && years > 0) {
        years = years + 1;
      }
      if (days > 16 && months > 0) {
        months = months + 1;
      }
      if (hours > 12 && days > 0) {
        days = days + 1;
      }
      if (minutes > 30 && hours > 0) {
        hours = hours + 1;
      }
      if (seconds > 30 && minutes > 0) {
        minutes = minutes + 1;
      }
    }

    if (years > 0) {
      string.push(years === 1 ? keys.years.single() : keys.years.plural(finalString(years)));

      return string.join(' ');
    } else if (months > 0) {
      string.push(months === 1 ? keys.months.single() : keys.months.plural(finalString(months)));

      return string.join(' ');
    } else if (days > 0) {
      string.push(days === 1 ? keys.days.single() : keys.days.plural(finalString(days)));

      return string.join(' ');
    } else if (days < 1 && hours > 0) {
      string.push(hours === 1 ? keys.hours.single() : keys.hours.plural(finalString(hours)));

      return string.join(' ');
    } else if (days < 1 && hours < 1 && minutes > 0) {
      string.push(minutes === 1 ? keys.minutes.single() : keys.minutes.plural(finalString(minutes)));

      return string.join(' ');
    } else {
      string.push(seconds === 1 ? keys.seconds.single() : keys.seconds.plural(finalString(seconds)));

      return string.join(' ');
    }
  }

  if (unit === 'days') {
    string.push(days === 1 ? keys.days.single() : keys.days.plural(finalString(days)));

    return string.join(' ');
  }

  if (unit === 'hours') {
    string.push(hours === 1 ? keys.hours.single() : keys.hours.plural(finalString(hours)));

    return string.join(' ');
  }

  if (unit === 'minutes') {
    string.push(minutes === 1 ? keys.minutes.single() : keys.minutes.plural(finalString(minutes)));

    return string.join(' ');
  }

  if (years > 0) {
    string.push(years === 1 ? keys.years.single() : keys.years.plural(finalString(years)));
    if (months > 0) string.push(months === 1 ? keys.months.single() : keys.months.plural(finalString(months)));
  }

  if (months > 0) {
    string.push(months === 1 ? keys.months.single() : keys.months.plural(finalString(months)));
    if (days > 0) string.push(days === 1 ? keys.days.single() : keys.days.plural(finalString(days)));
  }

  if (days > 0 && months < 1) {
    string.push(days === 1 ? keys.days.single() : keys.days.plural(finalString(days)));
    if (hours > 0) string.push(hours === 1 ? keys.hours.single() : keys.hours.plural(finalString(hours)));
  }

  if (days < 1 && hours > 0) {
    string.push(hours === 1 ? keys.hours.single() : keys.hours.plural(finalString(hours)));
    if (minutes > 0) string.push(minutes === 1 ? keys.minutes.single() : keys.minutes.plural(finalString(minutes)));
  }

  if (days < 1 && hours < 1 && minutes > 0) {
    string.push(minutes === 1 ? keys.minutes.single() : keys.minutes.plural(finalString(minutes)));
    if (seconds > 0) string.push(seconds === 1 ? keys.seconds.single() : keys.seconds.plural(finalString(seconds)));
  }

  if (days < 1 && hours < 1 && minutes < 1) {
    string.push(seconds === 1 ? keys.seconds.single() : keys.seconds.plural(finalString(seconds)));
  }

  return string.join(' ');
};

export const timestampToDifference = (timestamp, unit = 'seconds', start) => {
  const a = moment(timestamp);
  const b = moment(start);

  const difference = a.diff(b, unit);

  return {
    [unit]: difference,
  };
};

export const timestampToDuration = (timestamp, start = moment()) => {
  const end = moment(timestamp);
  const duration = moment.duration(end.diff(start));

  return {
    years: duration.get('years'),
    months: duration.get('months'),
    days: duration.get('days'),
    hours: duration.get('hours'),
    minutes: duration.get('minutes'),
    seconds: duration.get('seconds'),
    milliseconds: duration.get('milliseconds'),
  };
};

export const unixTimestampToDuration = (seconds) => {
  const duration = moment.duration(seconds);

  return {
    years: duration.get('years'),
    months: duration.get('months'),
    days: duration.get('days'),
    hours: duration.get('hours'),
    minutes: duration.get('minutes'),
    seconds: duration.get('seconds'),
    milliseconds: duration.get('milliseconds'),
  };
};

export const formatTime = (date = moment(), format) => {
  if (format === 'ISO8601') {
    return moment(date).toISOString();
  } else {
    return moment(date).format(format);
  }
};

export const addTime = (date = moment(), value, unit = 'seconds') => {
  return moment(date).add(value, unit);
};

export const fromNow = (date, abbreviated, withSuffix) => {
  const diff = timestampToDifference(new Date(), 'milliseconds', date);

  if (withSuffix) return t('Language.Time.Relative.Past', { duration: duration(unixTimestampToDuration(diff.milliseconds), { relative: true, round: true, abbreviated }) });

  return duration(unixTimestampToDuration(diff.milliseconds), { relative: true, round: true, abbreviated });
};

function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\\s]/g, '\\$&');
}

function escapeString(value, severe) {
  const full = ['#', '##', '###', '####', '#####', '######', '#', '**', '__', '*', '_', '***', '___', '__*', '**_', '>', '>>', '(', ')', '[', ']', '`', '``', '```', '---', '-', '+/', '/*', '*/'];
  const lite = ['#', '##', '###', '####', '#####', '######', '#', '**', '*', '__', '___', '__*', '**_', '`', '``', '```', '---'];

  const patterns = severe ? full : lite;

  patterns.forEach((text) => {
    const test = new RegExp(`${escapeRegExp(text)}`, 'g');

    value = value.replace(test, '\\$&');
  });

  return value;
}

export function BungieText(props) {
  const { className, value = '', textOnly, trim, single, energy, ...rest } = props;

  // get first sentence
  let source = single ? value.split('\n')[0] : value;

  // double line breaks
  source = source.replace(/\n/g, '\n\n');
  // replace • with actual list items
  source = source.replace(/•/g, '-');

  // chop any trailing colons off
  source =
    source.substr(source.length - 1) === ':'
      ? trim && source.slice(0, -1).length < +trim + 10 // if is less than trim length
        ? source.slice(0, -1) + '...' // append ellipsis
        : source.slice(0, -1)
      : source;

  // trim and append ellipsis
  source = trim && source.length > +trim + 10 ? source.slice(0, +trim + 10).trim() + '...' : source;

  // add icons
  source = stringToIcons(source, true);

  const disallowedTypes = textOnly && noParagraphs;

  const renderers = {};

  // wrap energy words
  if (energy) {
    renderers.text = wrapEnergy;
  }

  return <ReactMarkdown className={className} source={source} {...rest} renderers={renderers} disallowedTypes={disallowedTypes} unwrapDisallowed />;
}

export function BraytechText(props) {
  const { className, value = '', textOnly, escapeValue, ...rest } = props;

  const disallowedTypes = textOnly && noParagraphs;

  const source = escapeValue ? stringToIcons(escapeString(value), true) : stringToIcons(value, true);

  return <ReactMarkdown className={className} source={source} {...rest} renderers={{ link: markdownHelper_link, listItem: markdownHelper_listItem }} disallowedTypes={disallowedTypes} unwrapDisallowed />;
}

export function withinString(type, activityName) {
  if (type === 'lost-sector') {
    return t('Maps.Within.LostSector', { activityName });
  } else if (type === 'strike') {
    return t('Maps.Within.Strike', { activityName });
  } else if (type === 'story') {
    return t('Maps.Within.Story', { activityName });
  } else if (type === 'ascendant-challenge') {
    return t('Maps.Within.AscendantChallenge', { activityName });
  } else if (activityName) {
    return t('Maps.Within.ActivityName', { activityName });
  } else {
    return t('Maps.Within.Activity');
  }
}

export function unavailableString(status) {
  if (status === 'removed') {
    return t('Maps.Nodes.UnavailableInGame');
  } else if (status === 'api') {
    return t('Maps.Nodes.UnavailableUnreliableApi');
  } else {
    return t('Maps.Nodes.Unavailable');
  }
}

export const Energy = {
  Solar: ['solar', 'solare', 'solares', 'огня'],
  Arc: ['arc', 'arco', 'молнии'],
  Void: ['void', 'vacío', 'vuoto', 'vácuo', 'пустоты'],
};

export function basic(string) {
  return string.toLowerCase().replace(/[^\s0-9_A-Za-zÀ-ÖØ-öø-ÿ]+/g, '');
}

export function energyAffinity(string) {
  if (Energy.Solar.indexOf(string) > -1) {
    return 'solar';
  }

  if (Energy.Arc.indexOf(string) > -1) {
    return 'arc';
  }

  if (Energy.Void.indexOf(string) > -1) {
    return 'void';
  }

  return false;
}

const stringBeautifierMap = {
  source: [
    'Quelle: ', // de
    'Source: ', // en
    'Source: ', // fr
    'Fuente: ', // es
    'Fuente: ', // es-mx
    'Fonte: ', // it
    '入手方法: ', // ja
    '출처: ', // ko
    'Źródło: ', // pl
    'Fonte: ', // pt-br
    'Источник: ', // ru
    '來源：', // zh-cht
    '来源：', // zh-chs
  ],
};

export function stringBeautifier(key, string) {
  if (stringBeautifierMap[key]) {
    return stringBeautifierMap[key].reduce((string, value) => string.replace(value, ''), string);
  } else {
    return string;
  }
}
