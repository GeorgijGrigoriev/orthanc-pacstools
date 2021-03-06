const orthanc_address = window.location.origin;
$(window).on('load', function (e) {
    getCurrentModalitiesCount();
    addNewModality();
    updateModalityTable();
    rigthClickOnTableContextMenu();
    getCurrentPatients();
    getCurrentStudies();
    $('#add-new-modality-form input[type="text"]').blur(function(){
        if (!$(this).val()) {
            $(this).addClass('uk-form-danger');
        } else {
            $(this).removeClass('uk-form-danger');
            $(this).addClass('uk-form-success');
        }
    })
});
function getCurrentModalitiesCount(){
    $.ajax({
    url: orthanc_address + "/modalities",
    method: "GET",
    success: function(data){
        $('#current-modalities').empty().text(data.length);
    },
    fail: function(data){
        alertToUser("Unable to get data. Original message: " + data);
    }
});
}
function addNewModality(){
    $('#add-new-modality-form').on('submit', function(e){
        e.preventDefault();
        var $self = $(this);
        var data = getFormData($self);
        var url = orthanc_address + "/modalities/" + data.AET;
        var data = JSON.stringify(data);
        $.ajax({
            url: url,
            method: "PUT",
            data: data,
            success: function(data){
                updateModalityTable();
                getCurrentModalitiesCount();
                alertToUser("New modality added succesfully");
                $self.find("input[type=text]").val("");
            },
            fail: function(data){
                alertToUser("Unable to add modality. Original message: " + data);
            }
        })
    });
}

function rigthClickOnTableContextMenu(){
    var dropdownMenu = $('.dropper');
    var dropdown = UIkit.dropdown(dropdownMenu);
    var dropdownModalityName = $('#dropdown-modality-name');
    var dropdownDeleteButton = $('#dropdown-delete-modality-button');
    $(document).on('contextmenu', '.modality-entry', function(e){
        e.preventDefault();
        dropdownDeleteButton.attr('id','').attr('id', e.currentTarget.id);
        dropdownModalityName.text(e.currentTarget.id);
        //var offset = $(this).offset();
        var posX = e.pageX - 150;
        var posY = e.pageY - 170;
        dropdown.show();
        dropdownMenu.css({top: posY, left: posX});
    });

    $(document).on('click', function(){
        dropdown.hide(false);
    });
    $('#dropdown-delete-modality-button').on('click', function(e){
        e.preventDefault();
        var modalityToDelete = e.currentTarget.id;
        $.ajax({
            url: orthanc_address + "/modalities/" + modalityToDelete,
            method: "DELETE",
            success: function(){
                alertToUser('Modality ' + modalityToDelete + ' deleted succesfully.');
                updateModalityTable();
                getCurrentModalitiesCount();
            },
            fail: function(){
                alertToUser('Unable to delete modality.');
            }
        })
    });
}

function alertToUser(msg){
    var alert = $('.alert'),
    alertMessage = $('#alert-message');
    alertMessage.text(msg);
    alert.show().delay(2000).hide('slow');
}

function updateModalityTable(){
    $('#try-load-modalities').show();
    var $tb = $('#modalities-table-body');
    $tb.empty();
    $.ajax({
        url: orthanc_address + "/modalities?expand",
        type: "GET",
        success: function(data){
            for (var k in data){
                var $tr = $('<tr />',{
                    class: "modality-entry",
                    id: k,
                }).appendTo($tb);
                var $td_modality = $('<td />', {
                    text: k,
                }).appendTo($tr);
                var $td_aet = $('<td />', {
                    text: data[k].AET,
                }).appendTo($tr);
                var $td_host = $('<td />', {
                    text: data[k].Host,
                }).appendTo($tr);
                var $td_port = $('<td />', {
                    text: data[k].Port,
                }).appendTo($tr);
            }
            $('#try-load-modalities').hide();

        },
        fail: function(data){
            alertToUser("Unable to get data. Original message: " + data);
        }
    })
    
}

function getCurrentPatients(){
    var sign = $('#current-patients');
    $.ajax({
        url: orthanc_address + "/patients",
        method: "GET",
        success: function(data){
            sign.text(data.length);
        }
    })
}

function getCurrentStudies(){
    var sign = $('#current-studies');
    $.ajax({
        url: orthanc_address + "/studies",
        method: "GET",
        success: function(data){
            sign.text(data.length);
        }
    })
}

function getFormData($form){
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}
