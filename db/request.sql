-- Envoyer une demande d'ami
INSERT INTO friendships (user_id, friend_id, status) 
VALUES (1, 2, 'pending');

-- Accepter une demande
UPDATE friendships 
SET status = 'accepted', updated_at = CURRENT_TIMESTAMP 
WHERE user_id = 2 AND friend_id = 1 AND status = 'pending';

-- Voir mes amis
SELECT u.* FROM users u
INNER JOIN friendships f ON (f.friend_id = u.id OR f.user_id = u.id)
WHERE (f.user_id = 1 OR f.friend_id = 1) 
AND f.status = 'accepted' 
AND u.id != 1;

-- Demandes en attente
SELECT u.* FROM users u
INNER JOIN friendships f ON f.user_id = u.id
WHERE f.friend_id = 1 AND f.status = 'pending';