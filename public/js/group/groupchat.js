$(document).ready(function(){
    var socket = io();
    
    var room = $('#groupName').text();
    var sender = $('#sender').val();
    var userPic = $('#name-image').val();
    
    socket.on('connect', function(){
        console.log('Yea user connected');
        
        var params = {
            room: room,
            name: sender
        }
        socket.emit('join', params, function(){
            console.log('user has joined');
        });
    });
    
    socket.on('usersList', function(newUser){
        const users = newUser.filter(user => user !== sender)
        var ol = $('<ol></ol>');
        
        for(var i = 0; i < users.length; i++){
            ol.append('<p><a id="val" data-toggle="modal" data-target="#myModal">'+
            '<i class="fa fa-circle online icon-circle"></i>'+users[i]+
            '</a></p>');
        }
        
        $(document).on('click', '#val', function(){
            $('#name').text('@'+$(this).text());
            $('#receiverName').val($(this).text());
            $('#nameLink').attr("href", "/profile/"+$(this).text());
        });
        
        $('#numValue').text('('+users.length+')');
        $('#users').html(ol);
    });
    
    socket.on('newMessage', function(data){
        console.log(data);
        
        var template = $('#message-template').html();
        var message = Mustache.render(template, {
            text: data.text,
            sender: data.sender,
            userImage: data.image
        });
        
        $('#messages').append(message);
    });
    
    
    
    $('#message-form').on('submit', function(e){
        e.preventDefault();
        
        var msg = $('#msg').val();
        
        console.log(room);
        socket.emit('createMessage', {
            text: msg,
            room: room,
            sender: sender,
            userPic: userPic
        }, function(){
            $('#msg').val('');
        });
        
        return;
        $.ajax({
            url: '/group/'+room,
            type: 'POST',
            data: {
                message: msg,
                groupName: room
            },
            success: function(){
                $('#msg').val('');
            }
        })
        
    });
    
});











