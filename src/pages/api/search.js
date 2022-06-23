import Cosmic from 'cosmicjs';

const bucket = Cosmic().bucket({
  slug: process.env.NEXT_PUBLIC_COSMIC_BUCKET_SLUG,
  read_key: process.env.NEXT_PUBLIC_COSMIC_READ_KEY,
} )

export default async function searchHandler( req,res ) {
  const { query: {min, max, color, categories} } = req;

  let queryParam = {};

  if( min || max ) {
    queryParam = { ...queryParam, "metadata.price": {"$gte": Number(min || 1), "$lte": Number(max || 100000) },}
  }

  if(color?.toLocaleLowerCase() !== "colors") {
    queryParam = { ...queryParam, "metadata.color": color,}
  }

  if( categories ) {
    queryParam = { ...queryParam, "metadata.categories": categories,}
  }


  const params = {
    query: {
      ...queryParam,
      type: 'products',
    },
    props: 'title,slug,metadata,created_at',
  }

  try {
    const data = await bucket.getObjects(params)
    res.status( 200 ).json(data);
  } catch (error) {
    res.status(404).json(error.message)
  }
}











