$(document).ready(function(){
    $('.upload-btn').on('click', function(){
        $('#upload-input').click();
    });
    
    $('#submit').on('click', function(){
        var uploadInput = $('#upload-input');
        const club = $('input[name=club]')
        const country = $('input[name=country]');

        if(uploadInput.val() != ''){
            var formData = new FormData();
            
            formData.append('upload', uploadInput[0].files[0]);
            formData.append('club', club.val());
            formData.append('country', country.val())

            $.ajax({
                url: '/uploadFile',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(){
                    alert('success')
                    uploadInput.val('');
                    club.val('');
                    country.val('');
                }
            })
        }
    })
})