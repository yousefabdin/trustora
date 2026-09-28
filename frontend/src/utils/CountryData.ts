import countriesLocale from "i18n-iso-countries/langs/en.json";
import countryList from "i18n-iso-countries";

countryList.registerLocale(countriesLocale);

export const countries = Object.entries(
  countryList.getNames("en", { select: "official" }),
).map(([code, name]) => ({
  code,
  name,
}));
