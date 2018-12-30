/*jshint esversion: 6 */

const client = new Discord.Client({
  messageCacheMaxSize: 5,
  fetchAllMembers: false
});

client.on('ready', function() {
  $('.bot-name').html(client.user.username);
  $('.bot-discriminator').html('#' + client.user.discriminator);
  $('.bot-guilds').html(client.guilds.size);
  $('.bot-channels').html(client.channels.size);
  $('.bot-users').html(client.users.size);
  $('img.bot-avatar').attr('src', client.user.displayAvatarURL);
  $('link.bot-avatar').attr('href', client.user.displayAvatarURL);

  createCharts(client);
});
