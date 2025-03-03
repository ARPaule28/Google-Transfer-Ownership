const { drive } = require('./config/googleAuth');

async function requestOwnershipTransfer(fileId, newOwnerEmail) {
  try {
    // Step 1: Get existing permissions of the file
    const permissions = await drive.permissions.list({
      fileId,
      fields: 'permissions(emailAddress, role, id)',
    });

    // Step 2: Check if the new owner already has permissions
    let permissionId;
    const existingPermission = permissions.data.permissions.find(
      (perm) => perm.emailAddress === newOwnerEmail
    );

    // If the new owner doesn't have any permission yet, add 'writer' permission
    if (!existingPermission) {
      console.log(`Adding writer permission for ${newOwnerEmail}...`);
      const permission = await drive.permissions.create({
        fileId,
        requestBody: {
          type: 'user',
          role: 'writer',
          pendingOwner: true,
          emailAddress: newOwnerEmail,
        },
        fields: 'id',
      });
      permissionId = permission.data.id;  // Store the permission ID
    } else {
      console.log(`${newOwnerEmail} already has ${existingPermission.role} permission.`);
      permissionId = existingPermission.id;  // Use the existing permission ID
    }

    // Step 3: Update the permission with role 'owner' and transferOwnership=true to initiate ownership transfer
    await drive.permissions.update({
      fileId,
      permissionId,
      requestBody: {
        role: "writer",
        pendingOwner: true,
      },
    });

    console.log(`Ownership transfer request initiated for ${fileId}.`);
    console.log(`The new owner (${newOwnerEmail}) will need to manually accept the ownership transfer in Google Drive.`);

  } catch (error) {
    console.error('Error initiating ownership transfer:', error.message);

    // Handle consent error
    if (error.response && error.response.data && error.response.data.error) {
      if (error.response.data.error.message === 'Consent is required to transfer ownership of a file to another user.') {
        console.log('As the current owner, you must approve the ownership transfer in Google Drive.');
      }
      console.error('Detailed error:', error.response.data.error);
    }
  }
}

// Example usage:
const fileId = '1srqZy6X3RBQnzjY_dwwVA-ekzqPZ6M04EPD4dxaq8m0';
const newOwnerEmail = 'langbo683@gmail.com';

requestOwnershipTransfer(fileId, newOwnerEmail);
