const Ticket = require('../models/ticketModel');
const FollowUp = require('../models/followUpModel');

const checkSLA = async (id) => {
  try {
    // Get work order
    const ticket = await Ticket.findById(id);
    if (ticket.status == "Assigned") {
      const followUp = FollowUp({
        creationDate: ticket.creationDate,
        finishDate: ticket.finishDate,
        title: ticket.title,
        description: ticket.description,
        clientId: ticket.clientId,
        siteId: ticket.siteId,
        type: ticket.type,
        equipmentSoftId: ticket.equipmentSoftId,
        equipmentHardId: ticket.equipmentHardId,
        technicienId: ticket.technicienId,
        listOfFiles: ticket.listOfFiles,
      });
      const nbrfol = ticket.followUpList.length + 1
      followUp.title += " - " + nbrfol
      ticket.followUpList.push(followUp);
      ticket.isFollowUp = true;
      ticket.status = 'Expired';
      await followUp.save();
      await ticket.save();
      console.log("------------------------------------------------------------------------------");
      console.log("SLA ALA SLA SLA Has ben change on ticket ref " + id + "JSUST CHECK IT ");
      console.log("------------------------------------------------------------------------------");
    }
  } catch (error) {
    console.error('Error occurred while checking SLA:', error);
  }
};

module.exports = checkSLA;