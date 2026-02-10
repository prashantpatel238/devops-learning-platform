module "network" {
  source       = "../../modules/network"
  project_name = var.project_name
  aws_region   = var.aws_region
}

output "vpc_id" {
  value = module.network.vpc_id
}
