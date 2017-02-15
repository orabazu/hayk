String.prototype.replaceAll = function (search, replacement) {
    var target = this;

    return target.split(search).join(replacement);
};


window.loadAutoComplete = function () {
    $('.geocode-autocomplete').each(function () {
        var that = this;
        $(that).typeahead({
            source: function (query, process) {
                var predictions = [];
                $.getJSON('http://geocode-maps.yandex.ru/1.x/?results=5&bbox=24.125977,34.452218~45.109863,42.601620&format=json&lang=tr_TR&geocode=' + query, function (data) {
                    for (var i = 0; i < data.response.GeoObjectCollection.featureMember.length; i++) {
                        var item = {
                            name: data.response.GeoObjectCollection.featureMember[i].GeoObject.name,
                            description: data.response.GeoObjectCollection.featureMember[i].GeoObject.description,
                            longlat: data.response.GeoObjectCollection.featureMember[i].GeoObject.Point.pos,
                            type: data.response.GeoObjectCollection.featureMember[i].GeoObject.metaDataProperty.GeocoderMetaData.kind,
                            alt_type: data.response.GeoObjectCollection.featureMember[i].GeoObject.metaDataProperty.GeocoderMetaData,
                            bbox: data.response.GeoObjectCollection.featureMember[i].GeoObject.boundedBy.Envelope,
                        };
                        if (item.description.indexOf('Türkiye') === -1)
                            continue;
                        predictions.push(item);
                    }

                    return process(predictions);
                });
            },
            afterSelect: function (item) {
                console.log(item);
                 var a = document.createElement('a');
                    a.href = '/a/'+ item.name
                    +'?latSW=' + item.bbox.lowerCorner.split(' ')[0]
                    +'&lngSW='+item.bbox.lowerCorner.split(' ')[1]
                    +'&latNE='+ item.bbox.upperCorner.split(' ')[0]
                    +'&lngNE='+ item.bbox.upperCorner.split(' ')[1]
                    ;
                    document.body.appendChild(a);
                    a.click();
                // setTimeout(function () { document.activeElement.blur(); }, 0);
                // setTimeout(function () {
                //     if ($(that).attr('data-from') == "headline-search-button") {
                //         $('#headline-search-button').click();
                //         // $('#ed-top-nav-address-input-mobile').val($(that).val());                        
                //         return false;
                //     }
                // }, 100);
            },
            highlighter: function (item) {
                item = '<span class="item-address">' + item + '</span>';
                return item;
            },
            minLength: 3,
            fitToElement: true,
            matcher: function () {
                return true;
            },
            updater: function (item) {
                return item;
            }
        });
        $(that).on('typeahead:change',
            function (e, item) {
                 $(that).val(item.find('a>span.item-address').text());
            });

    });
}

window.loadAutoComplete();