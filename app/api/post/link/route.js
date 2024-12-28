import { NextResponse } from 'next/server';
import Episode from '@/models/episode';
import PostLink from '@/models/postLinks';
import { jsonResponse } from '@/lib/jsonResponse';

// Utility function to extract domain name from URL
const extractDomainName = (url) => {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?([^\/\s]+)/);
    if (match) {
        return match[1].split('.')[0]; // Taking the first part of the domain
    }
    return '';
};

export async function POST(req) {
    try {
        const { postId, episodes } = await req.json();

        if (!postId || !episodes) {
            return NextResponse.json(
                { error: 'Post ID and episodes are required' },
                { status: 400 }
            );
        }

        // Start a transaction
        const transaction = await Episode.sequelize.transaction();

        try {
            const createdEpisodes = [];
            const postLinkData = [];

            for (const episode of episodes) {
                // Create each episode
                const newEpisode = await Episode.create(
                    { post_id: postId, title: episode.title },
                    { transaction }
                );

                createdEpisodes.push(newEpisode);

                // Create links for this episode
                for (const link of episode.links) {
                    const domainName = extractDomainName(link.url);
                    postLinkData.push({
                        episode_id: newEpisode.id, // Use the current episode's ID
                        quality: link.quality,
                        name: domainName,
                        url: link.url,
                    });
                }
            }

            // Bulk create post links
            await PostLink.bulkCreate(postLinkData, { transaction });

            // Commit the transaction
            await transaction.commit();

            return jsonResponse({ msg: 'Episodes and links added successfully' }, 201);
        } catch (error) {
            // Rollback the transaction if any error occurs
            await transaction.rollback();
            console.error(error);
            return jsonResponse({ msg: 'Error adding episodes and links' }, 500);
        }
    } catch (error) {
        console.error(error);
        return jsonResponse({ msg: 'Error processing the request' }, 500);
    }
}



export async function PUT(req) {
    try {
      const { title, post_links, id } = await req.json();
  
      if (!id || !title || !Array.isArray(post_links)) {
        return NextResponse.json(
          { error: 'Episode ID, title, and post_links are required' },
          { status: 400 }
        );
      }
  
      // Start a transaction
      const transaction = await Episode.sequelize.transaction();
  
      try {
        // Update the episode title
        const episode = await Episode.findByPk(id);
  
        if (!episode) {
          return NextResponse.json(
            { error: 'Episode not found' },
            { status: 404 }
          );
        }
  
        await episode.update({ title }, { transaction });
  
        // Remove all existing links for the episode
        await PostLink.destroy({ where: { episode_id: id }, transaction });
  
        // Add the updated links
        const newLinks = post_links.map((link) => {
          const domainName = extractDomainName(link.url); // Function to extract domain name
          return {
            episode_id: id,
            quality: link.quality,
            name: domainName,
            url: link.url,
          };
        });
  
        await PostLink.bulkCreate(newLinks, { transaction });
  
        // Commit the transaction
        await transaction.commit();
  
        return NextResponse.json({ msg: 'Episode updated successfully' }, { status: 200 });
      } catch (error) {
        // Rollback the transaction in case of error
        await transaction.rollback();
        console.error(error);
        return NextResponse.json(
          { error: 'Error updating episode' },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: 'Error processing the request' },
        { status: 500 }
      );
    }
  }
