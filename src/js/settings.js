$(document).ready(function () {

    var accounts = [],
        accountList = $('#account-list'),
        actions = $('<div>', { 'class': 'btn-group'});

    actions.append($('<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">Action <span class="caret"></span></button>'));
    actions.append(
        $('<ul class="dropdown-menu" role="menu"></ul>')
            .append($('<li><a href="#" data-action="account-edit" data-target="#accountSettings"><i class="glyphicon glyphicon-cog"></i> Edit</a></li>'))
            .append($('<li class="divider"></li>'))
            .append($('<li><a href="#" data-action="account-delete"><i class="glyphicon glyphicon-trash"></i> Delete</a></li>'))
    );

    function updateAccountList()
    {
        accounts = E.$.accounts.load() || [];
        accountList.empty();
        accounts.forEach(function(account, idx){
            var row = $('<tr>')
                .append($('<td>', {
                    html: idx+1
                }))
                .append($('<td>', {
                    html: account.serverEWS
                }))
                .append($('<td>', {
                    html: account.username
                }))
                .append($('<td>', {
                    'data-idx': idx,
                    html: actions.clone()
                }));

            accountList.append(row);
        });
    }

    updateAccountList();

    $(document).on('submit', 'form#form-account', function(){
        var $this = $(this),
            idx = $this.find('[name="idx"]').val().toInt(accounts.length);

        accounts[idx] = {
            serverEWS: $this.find('[name="serverEWS"]').val(),
            serverOWA: $this.find('[name="serverOWA"]').val(),
            username:  $this.find('[name="username"]').val(),
            password:  $this.find('[name="password"]').val(),
            unread: 0
        };
        E.$.accounts.save(accounts);
        updateAccountList();

        return false;
    });

    $(document).on('click','[data-action="account-add"]', function(){
        var $this = $(this),
        target = $($this.data('target'));
        target.find('form')[0].reset();
        target.modal('show');
    });

    $(document).on('click','[data-action="account-edit"]', function(){
        var $this = $(this),
            idx = $this.parents('[data-idx]').data('idx').toInt(),
            account = accounts[idx],
            target = $($this.data('target'));
        target.find('form')[0].reset();
        account['idx'] = idx;
        Object.keys(account).forEach(function(name){
            target.find('input[name="'+name+'"]').val(account[name]);
        });
        target.modal('show');
    });

    $(document).on('click','[data-action="account-delete"]', function(){
        var $this = $(this),
            idx = $this.parents('[data-idx]').data('idx').toInt();
        accounts.splice(idx,1);
        E.$.accounts.save(accounts);
        updateAccountList();
    });



    var formOptions = $('form#notifier-options'),
        options = E.$.options.load() || {};

    Object.keys(options).forEach(function(name){
        formOptions.find('[data-options="'+name+'"]').val(options[name]).trigger('change');
    });

    formOptions.on('submit', function(e){
        Object.keys(options).forEach(function(name){
            options[name] = formOptions.find('[data-options="'+name+'"]').val();
        });
        E.$.options.save(options);
        $('div.alert.alert-success').slideDown();
        setTimeout(function () {
            $('div.alert.alert-success').slideUp();
        }, 3000);

        return false;
    });

    formOptions.find('input[type="range"]').on('change',function () {
        var el = $(this),
            display = $(el.data('display'));
        display.html(Math.ceil(el.val()*100) + ' ' + el.data('unit'));
    });

    formOptions.find('input#volume').on('mouseup',function () {
        E.$.sound.volume($(this).val());
        E.$.sound.play();
    });
    $(document).find('input[type="range"]').trigger('change');
});