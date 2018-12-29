/*jshint esversion: 6 */

const client = new Discord.Client();

client.on('ready', function() {
  $('.bot-name').html(client.user.username);
  $('.bot-discriminator').html('#' + client.user.discriminator);
  $('.bot-avatar').attr('src', client.user.displayAvatarURL);

  createCharts(client);
});
