SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';


-- -----------------------------------------------------
-- Table `Student`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `Student` (
  `idStudent` INT NOT NULL ,
  `name` VARCHAR(45) NULL ,
  `surname` VARCHAR(45) NULL ,
  `techClass` VARCHAR(45) NULL ,
  `target` VARCHAR(45) NULL ,
  `notes` VARCHAR(500) NULL ,
  `gender` VARCHAR(1) NULL ,
  `form` VARCHAR(2) NULL ,
  PRIMARY KEY (`idStudent`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Assessment`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `Assessment` (
  `idAssessment` INT NOT NULL ,
  `Student_idStudent` INT NOT NULL ,
  `assessmentArea` INT NULL ,
  `timestamp` TIMESTAMP NULL ,
  `teacherComment` VARCHAR(256) NULL ,
  `teacher` VARCHAR(3) NULL ,
  `ncLevel` VARCHAR(2) NULL ,
  `effort` VARCHAR(2) NULL ,
  `created` DATETIME NULL ,
  `updated` DATETIME NULL ,
  PRIMARY KEY (`idAssessment`) ,
  INDEX `fk_Assessment_Student` (`Student_idStudent` ASC) ,
  CONSTRAINT `fk_Assessment_Student`
    FOREIGN KEY (`Student_idStudent` )
    REFERENCES `Student` (`idStudent` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
