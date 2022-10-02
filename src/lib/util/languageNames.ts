export function getDisplayNames(lang : string) : Intl.DisplayNames {
    return new Intl.DisplayNames(lang , {type: 'language'});
}