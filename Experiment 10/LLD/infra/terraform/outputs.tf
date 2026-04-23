output "vpc_id" {
  value = module.vpc.vpc_id
}

output "private_subnets" {
  value = module.vpc.private_subnets
}

output "media_bucket_name" {
  value = aws_s3_bucket.media.bucket
}
