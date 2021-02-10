import _ from 'lodash/fp'

const defaultHereConfig = {
  apiKey: '1nGXh3FMLSo7DKTP_2IpLoC_AUNE_8BGvxxwAK1q_LQ',
  country: 'USA',
  autocomplete: 'https://autocomplete.geocoder.api.here.com/6.2/suggest.json',
  geoCoding: 'https://geocoder.api.here.com/6.2/geocode.json?gen=9',
}

let formatAddress = ({ address, matchLevel }) => {
  let {
    country,
    district,
    city,
    state,
    street,
    county,
    postalCode,
    houseNumber,
  } = address
  street = `${street} ${city}, ${county}, ${state}`
  let geoLevel = {
    country,
    district: `${district} ${city} ${state}`,
    city: `${city} ${county} ${state}`,
    houseNumber: `${houseNumber} ${street}`,
    county: `${county}, ${state}`,
    state: `${state}, ${country}`,
    postalCode: `${city} ${county}, ${state}, ${postalCode}`,
    street,
    intersection: street,
  }
  return geoLevel[matchLevel]
}
export let loadHereOptions = async (
  inputValue,
  countryCode = 'USA',
  hereConfig = defaultHereConfig
) => {
  if (inputValue.length <= 2) return []
  if (typeof countryCode === 'object') {
    hereConfig = countryCode
    countryCode = 'USA'
  }
  hereConfig.country = countryCode
  let { autocomplete: url, apiKey, country } = hereConfig
  let apiUrl = `${url}?apiKey=${apiKey}&country=${country}&query=${inputValue}`

  let data = await (await fetch(apiUrl)).json()

  if (data.error) {
    console.error('loadHereOptions', data.error)
    throw new Error(data.error)
  } else {
    return _.getOr([], 'suggestions', data).map(d => ({
      label: formatAddress(d),
      value: d.locationId,
    }))
  }
}

export let getLocationInfo = async (
  locationId,
  hereConfig = defaultHereConfig
) => {
  let { geoCoding: url, app_id, app_code } = hereConfig
  let apiUrl = `${url}&app_id=${app_id}&app_code=${app_code}&locationid=${locationId}`

  let data = await (await fetch(apiUrl)).json()

  if (data.error) {
    console.error('geoCodeLocation', data.error)
    throw new Error(data.error)
  } else {
    return _.get('Response.View.0.Result.0', data)
  }
}

export let geoCodeLocation = async (
  locationId,
  hereConfig = defaultHereConfig
) =>
  _.flow(
    _.get('Location.DisplayPosition'),
    _.mapKeys(_.toLower)
  )(await getLocationInfo(locationId, hereConfig))
